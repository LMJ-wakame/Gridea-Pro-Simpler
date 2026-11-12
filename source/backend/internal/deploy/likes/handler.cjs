'use strict';
const {getStore,connectLambda} = require('@netlify/blobs');
const {isIP} = require('node:net');
const {vote} = require('./core.cjs');
const config = require('./config.json');

function requestOrigin(event) {
  if (event.rawUrl) {
    try { return new URL(event.rawUrl).origin; } catch { /* fall through */ }
  }
  const headers = event.headers || {};
  const host = headers.host || headers.Host;
  if (!host) return '';
  const proto = (headers['x-forwarded-proto'] || headers['X-Forwarded-Proto'] || 'https').split(',')[0].trim();
  return `${proto}://${host}`;
}

exports.handler = async event => {
  const reply=(statusCode,body)=>({statusCode,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(body)});
  if(!['GET','POST'].includes(event.httpMethod)) return reply(405,{error:'Method not allowed'});
  const post=event.queryStringParameters?.post;
  if(!config.posts.includes(post)) return reply(404,{error:'Post not found'});
  // Netlify overwrites this header at the trusted edge. Never use client X-Forwarded-For.
  const ip=event.headers?.['x-nf-client-connection-ip'];
  if(!ip || !isIP(ip)) return reply(400,{error:'Client IP unavailable'});
  const origin=event.headers?.origin;
  const expectedOrigin=requestOrigin(event);
  if(event.httpMethod==='POST' && origin && expectedOrigin && origin!==expectedOrigin) return reply(403,{error:'Origin not allowed'});
  try {
    connectLambda(event);
    const store=getStore({name:'gridea-post-likes',consistency:'strong'});
    return reply(200,await vote(store,{post,ip,method:event.httpMethod,timezone:config.timezone}));
  } catch { return reply(503,{error:'Likes temporarily unavailable'}); }
};
