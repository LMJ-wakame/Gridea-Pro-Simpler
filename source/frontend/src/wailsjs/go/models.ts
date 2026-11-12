export namespace ai {
	
	export class ProviderInfo {
	    id: string;
	    name: string;
	    protocol: string;
	    baseURL: string;
	    defaultModels: string[];
	    apiKeyURL: string;
	
	    static createFrom(source: any = {}) {
	        return new ProviderInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.protocol = source["protocol"];
	        this.baseURL = source["baseURL"];
	        this.defaultModels = source["defaultModels"];
	        this.apiKeyURL = source["apiKeyURL"];
	    }
	}

}

export namespace config {
	
	export class SiteEntry {
	    name: string;
	    path: string;
	    active: boolean;
	
	    static createFrom(source: any = {}) {
	        return new SiteEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.active = source["active"];
	    }
	}

}

export namespace domain {
	
	export class AICustomConfig {
	    model: string;
	    apiKey: string;
	    baseURL: string;
	
	    static createFrom(source: any = {}) {
	        return new AICustomConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.model = source["model"];
	        this.apiKey = source["apiKey"];
	        this.baseURL = source["baseURL"];
	    }
	}
	export class AISetting {
	    mode: string;
	    activeProvider: string;
	    customs: Record<string, AICustomConfig>;
	
	    static createFrom(source: any = {}) {
	        return new AISetting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mode = source["mode"];
	        this.activeProvider = source["activeProvider"];
	        this.customs = this.convertValues(source["customs"], AICustomConfig, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Category {
	    id: string;
	    name: string;
	    slug: string;
	    description: string;
	
	    static createFrom(source: any = {}) {
	        return new Category(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.slug = source["slug"];
	        this.description = source["description"];
	    }
	}
	export class CdnSetting {
	    enabled: boolean;
	    provider: string;
	    githubUser: string;
	    githubRepo: string;
	    githubBranch: string;
	    baseUrl: string;
	    githubToken: string;
	    savePath: string;
	
	    static createFrom(source: any = {}) {
	        return new CdnSetting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.enabled = source["enabled"];
	        this.provider = source["provider"];
	        this.githubUser = source["githubUser"];
	        this.githubRepo = source["githubRepo"];
	        this.githubBranch = source["githubBranch"];
	        this.baseUrl = source["baseUrl"];
	        this.githubToken = source["githubToken"];
	        this.savePath = source["savePath"];
	    }
	}
	export class Comment {
	    id: string;
	    avatar: string;
	    nickname: string;
	    email: string;
	    url: string;
	    content: string;
	    createdAt: string;
	    articleId: string;
	    articleTitle: string;
	    articleUrl: string;
	    parentId: string;
	    parentNick: string;
	    isNew: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Comment(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.avatar = source["avatar"];
	        this.nickname = source["nickname"];
	        this.email = source["email"];
	        this.url = source["url"];
	        this.content = source["content"];
	        this.createdAt = source["createdAt"];
	        this.articleId = source["articleId"];
	        this.articleTitle = source["articleTitle"];
	        this.articleUrl = source["articleUrl"];
	        this.parentId = source["parentId"];
	        this.parentNick = source["parentNick"];
	        this.isNew = source["isNew"];
	    }
	}
	export class CommentSettings {
	    enable: boolean;
	    platform: string;
	    platformConfigs: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new CommentSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.enable = source["enable"];
	        this.platform = source["platform"];
	        this.platformConfigs = source["platformConfigs"];
	    }
	}
	export class FileInfo {
	    name: string;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new FileInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	    }
	}
	export class ImageHostingFile {
	    file_id: number;
	    filename: string;
	    storename: string;
	    url: string;
	    delete: string;
	    hash: string;
	    path: string;
	    width: number;
	    height: number;
	    size: number;
	    created_at: number;
	    page: string;
	
	    static createFrom(source: any = {}) {
	        return new ImageHostingFile(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.file_id = source["file_id"];
	        this.filename = source["filename"];
	        this.storename = source["storename"];
	        this.url = source["url"];
	        this.delete = source["delete"];
	        this.hash = source["hash"];
	        this.path = source["path"];
	        this.width = source["width"];
	        this.height = source["height"];
	        this.size = source["size"];
	        this.created_at = source["created_at"];
	        this.page = source["page"];
	    }
	}
	export class ImageHostingListResponse {
	    code: number;
	    data: ImageHostingFile[];
	    message: string;
	    success: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ImageHostingListResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.data = this.convertValues(source["data"], ImageHostingFile);
	        this.message = source["message"];
	        this.success = source["success"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ImageHostingSetting {
	    enabled: boolean;
	    apiKey: string;
	
	    static createFrom(source: any = {}) {
	        return new ImageHostingSetting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.enabled = source["enabled"];
	        this.apiKey = source["apiKey"];
	    }
	}
	export class ImageOptimizeSetting {
	    enabled: boolean;
	    quality: number;
	
	    static createFrom(source: any = {}) {
	        return new ImageOptimizeSetting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.enabled = source["enabled"];
	        this.quality = source["quality"];
	    }
	}
	export class Link {
	    id: string;
	    name: string;
	    url: string;
	    description: string;
	    avatar: string;
	
	    static createFrom(source: any = {}) {
	        return new Link(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.url = source["url"];
	        this.description = source["description"];
	        this.avatar = source["avatar"];
	    }
	}
	export class Memo {
	    id: string;
	    content: string;
	    tags: string[];
	    images: string[];
	    createdAt: string;
	    updatedAt: string;
	
	    static createFrom(source: any = {}) {
	        return new Memo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.content = source["content"];
	        this.tags = source["tags"];
	        this.images = source["images"];
	        this.createdAt = source["createdAt"];
	        this.updatedAt = source["updatedAt"];
	    }
	}
	export class TagStat {
	    name: string;
	    count: number;
	
	    static createFrom(source: any = {}) {
	        return new TagStat(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.count = source["count"];
	    }
	}
	export class MemoStats {
	    total: number;
	    tags: TagStat[];
	    heatmap: Record<string, number>;
	
	    static createFrom(source: any = {}) {
	        return new MemoStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.total = source["total"];
	        this.tags = this.convertValues(source["tags"], TagStat);
	        this.heatmap = source["heatmap"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MemoDashboardDTO {
	    memos: Memo[];
	    stats: MemoStats;
	
	    static createFrom(source: any = {}) {
	        return new MemoDashboardDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.memos = this.convertValues(source["memos"], Memo);
	        this.stats = this.convertValues(source["stats"], MemoStats);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Menu {
	    id: string;
	    name: string;
	    link: string;
	    openType: string;
	    children?: Menu[];
	
	    static createFrom(source: any = {}) {
	        return new Menu(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.link = source["link"];
	        this.openType = source["openType"];
	        this.children = this.convertValues(source["children"], Menu);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PaginatedComments {
	    comments: Comment[];
	    total: number;
	    page: number;
	    pageSize: number;
	    totalPages: number;
	
	    static createFrom(source: any = {}) {
	        return new PaginatedComments(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.comments = this.convertValues(source["comments"], Comment);
	        this.total = source["total"];
	        this.page = source["page"];
	        this.pageSize = source["pageSize"];
	        this.totalPages = source["totalPages"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Post {
        versions: { language: string; title: string; content: string }[];
	    collection: string;
	    id: string;
	    title: string;
	    createdAt: string;
	    updatedAt: string;
	    tags: string[];
	    tagIds: string[];
	    categories: string[];
	    categoryIds: string[];
	    published: boolean;
	    hideInList: boolean;
	    isTop: boolean;
	    feature: string;
	    featureImagePath: string;
	    featureImage: FileInfo;
	    content: string;
	    fileName: string;
	    deleteFileName: string;
	    abstract: string;
	
	    static createFrom(source: any = {}) {
	        return new Post(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.collection = source["collection"];
            this.versions = source["versions"] || [];
	        this.id = source["id"];
	        this.title = source["title"];
	        this.createdAt = source["createdAt"];
	        this.updatedAt = source["updatedAt"];
	        this.tags = source["tags"];
	        this.tagIds = source["tagIds"];
	        this.categories = source["categories"];
	        this.categoryIds = source["categoryIds"];
	        this.published = source["published"];
	        this.hideInList = source["hideInList"];
	        this.isTop = source["isTop"];
	        this.feature = source["feature"];
	        this.featureImagePath = source["featureImagePath"];
	        this.featureImage = this.convertValues(source["featureImage"], FileInfo);
	        this.content = source["content"];
	        this.fileName = source["fileName"];
	        this.deleteFileName = source["deleteFileName"];
	        this.abstract = source["abstract"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PwaSetting {
	    enabled: boolean;
	    appName: string;
	    shortName: string;
	    description: string;
	    themeColor: string;
	    backgroundColor: string;
	    orientation: string;
	    customIcon: boolean;
	
	    static createFrom(source: any = {}) {
	        return new PwaSetting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.enabled = source["enabled"];
	        this.appName = source["appName"];
	        this.shortName = source["shortName"];
	        this.description = source["description"];
	        this.themeColor = source["themeColor"];
	        this.backgroundColor = source["backgroundColor"];
	        this.orientation = source["orientation"];
	        this.customIcon = source["customIcon"];
	    }
	}
	export class SeoSetting {
	    metaKeywords: string;
	    enableCanonicalURL: boolean;
	    ogDefaultImage: string;
	    enableOpenGraph: boolean;
	    twitterSite: string;
	    twitterCreator: string;
	    enableJsonLD: boolean;
	    googleSearchConsoleCode: string;
	    bingVerificationCode: string;
	    baiduVerificationCode: string;
	    "360VerificationCode": string;
	    yandexVerificationCode: string;
	    googleAnalyticsId: string;
	    baiduAnalyticsId: string;
	    plausibleDomain: string;
	    umamiWebsiteId: string;
	    umamiScriptUrl: string;
	    cloudflareWebAnalyticsToken: string;
	    sitemapEnabled: boolean;
	    robotsEnabled: boolean;
	    robotsCustom: string;
	    customHeadCode: string;
	    customBodyStartCode: string;
	    customBodyEndCode: string;
	
	    static createFrom(source: any = {}) {
	        return new SeoSetting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metaKeywords = source["metaKeywords"];
	        this.enableCanonicalURL = source["enableCanonicalURL"];
	        this.ogDefaultImage = source["ogDefaultImage"];
	        this.enableOpenGraph = source["enableOpenGraph"];
	        this.twitterSite = source["twitterSite"];
	        this.twitterCreator = source["twitterCreator"];
	        this.enableJsonLD = source["enableJsonLD"];
	        this.googleSearchConsoleCode = source["googleSearchConsoleCode"];
	        this.bingVerificationCode = source["bingVerificationCode"];
	        this.baiduVerificationCode = source["baiduVerificationCode"];
	        this["360VerificationCode"] = source["360VerificationCode"];
	        this.yandexVerificationCode = source["yandexVerificationCode"];
	        this.googleAnalyticsId = source["googleAnalyticsId"];
	        this.baiduAnalyticsId = source["baiduAnalyticsId"];
	        this.plausibleDomain = source["plausibleDomain"];
	        this.umamiWebsiteId = source["umamiWebsiteId"];
	        this.umamiScriptUrl = source["umamiScriptUrl"];
	        this.cloudflareWebAnalyticsToken = source["cloudflareWebAnalyticsToken"];
	        this.sitemapEnabled = source["sitemapEnabled"];
	        this.robotsEnabled = source["robotsEnabled"];
	        this.robotsCustom = source["robotsCustom"];
	        this.customHeadCode = source["customHeadCode"];
	        this.customBodyStartCode = source["customBodyStartCode"];
	        this.customBodyEndCode = source["customBodyEndCode"];
	    }
	}
	export class Setting {
	    platform: string;
	    platformConfigs?: Record<string, any>;
	    enabledPlatforms?: string[];
	    proxyEnabled: boolean;
	    proxyURL: string;
	    notifyOnDeployComplete?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Setting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.platform = source["platform"];
	        this.platformConfigs = source["platformConfigs"];
	        this.enabledPlatforms = source["enabledPlatforms"];
	        this.proxyEnabled = source["proxyEnabled"];
	        this.proxyURL = source["proxyURL"];
	        this.notifyOnDeployComplete = source["notifyOnDeployComplete"];
	    }
	}
	export class Tag {
	    id: string;
	    name: string;
	    slug: string;
	    used: boolean;
	    color?: string;
	
	    static createFrom(source: any = {}) {
	        return new Tag(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.slug = source["slug"];
	        this.used = source["used"];
	        this.color = source["color"];
	    }
	}
	
	export class Theme {
	    folder: string;
	    name: string;
	    version: string;
	    description?: string;
	    author?: string;
	    repository?: string;
	    previewImage?: string;
	    customConfig?: any[];
	
	    static createFrom(source: any = {}) {
	        return new Theme(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.folder = source["folder"];
	        this.name = source["name"];
	        this.version = source["version"];
	        this.description = source["description"];
	        this.author = source["author"];
	        this.repository = source["repository"];
	        this.previewImage = source["previewImage"];
	        this.customConfig = source["customConfig"];
	    }
	}
	export class ThemeConfig {
	    themeName: string;
	    postPageSize: number;
	    archivesPageSize: number;
	    siteName: string;
	    siteAuthor: string;
	    siteEmail: string;
	    siteDescription: string;
	    footerInfo: string;
	    domain: string;
	    postUrlFormat: string;
	    tagUrlFormat: string;
	    dateFormat: string;
	    language: string;
	    feedEnabled: boolean;
	    feedFullText: boolean;
	    feedCount: number;
	    postPath: string;
	    tagPath: string;
	    tagsPath: string;
	    linkPath: string;
	    memosPath: string;
	    katexEnabled: boolean;
	    customConfig?: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new ThemeConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.themeName = source["themeName"];
	        this.postPageSize = source["postPageSize"];
	        this.archivesPageSize = source["archivesPageSize"];
	        this.siteName = source["siteName"];
	        this.siteAuthor = source["siteAuthor"];
	        this.siteEmail = source["siteEmail"];
	        this.siteDescription = source["siteDescription"];
	        this.footerInfo = source["footerInfo"];
	        this.domain = source["domain"];
	        this.postUrlFormat = source["postUrlFormat"];
	        this.tagUrlFormat = source["tagUrlFormat"];
	        this.dateFormat = source["dateFormat"];
	        this.language = source["language"];
	        this.feedEnabled = source["feedEnabled"];
	        this.feedFullText = source["feedFullText"];
	        this.feedCount = source["feedCount"];
	        this.postPath = source["postPath"];
	        this.tagPath = source["tagPath"];
	        this.tagsPath = source["tagsPath"];
	        this.linkPath = source["linkPath"];
	        this.memosPath = source["memosPath"];
	        this.katexEnabled = source["katexEnabled"];
	        this.customConfig = source["customConfig"];
	    }
	}
	export class UploadedFile {
	    name: string;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new UploadedFile(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	    }
	}

}

export namespace facade {
	
	export class CategoryCascadeResult {
	    categories: domain.Category[];
	    posts: domain.Post[];
	
	    static createFrom(source: any = {}) {
	        return new CategoryCascadeResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.categories = this.convertValues(source["categories"], domain.Category);
	        this.posts = this.convertValues(source["posts"], domain.Post);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CategoryForm {
	    id: string;
	    name: string;
	    slug: string;
	    description: string;
	    originalSlug: string;
	
	    static createFrom(source: any = {}) {
	        return new CategoryForm(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.slug = source["slug"];
	        this.description = source["description"];
	        this.originalSlug = source["originalSlug"];
	    }
	}
	export class LinkForm {
	    id: string;
	    name: string;
	    url: string;
	    avatar: string;
	    description: string;
	
	    static createFrom(source: any = {}) {
	        return new LinkForm(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.url = source["url"];
	        this.avatar = source["avatar"];
	        this.description = source["description"];
	    }
	}
	export class MenuForm {
	    name: string;
	    openType: string;
	    link: string;
	    index: any;
	
	    static createFrom(source: any = {}) {
	        return new MenuForm(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.openType = source["openType"];
	        this.link = source["link"];
	        this.index = source["index"];
	    }
	}
	export class PostDashboardDTO {
	    posts: domain.Post[];
	    tags: domain.Tag[];
	
	    static createFrom(source: any = {}) {
	        return new PostDashboardDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.posts = this.convertValues(source["posts"], domain.Post);
	        this.tags = this.convertValues(source["tags"], domain.Tag);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PostForm {
        versions: { language: string; title: string; content: string }[];
	    collection: string;
	    id: string;
	    title: string;
	    createdAt: string;
	    tags: string[];
	    tagIds: string[];
	    categories: string[];
	    categoryIds: string[];
	    published: boolean;
	    hideInList: boolean;
	    isTop: boolean;
	    content: string;
	    fileName: string;
	    deleteFileName: string;
	    featureImage: domain.FileInfo;
	    featureImagePath: string;
	
	    static createFrom(source: any = {}) {
	        return new PostForm(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.collection = source["collection"];
            this.versions = source["versions"] || [];
	        this.id = source["id"];
	        this.title = source["title"];
	        this.createdAt = source["createdAt"];
	        this.tags = source["tags"];
	        this.tagIds = source["tagIds"];
	        this.categories = source["categories"];
	        this.categoryIds = source["categoryIds"];
	        this.published = source["published"];
	        this.hideInList = source["hideInList"];
	        this.isTop = source["isTop"];
	        this.content = source["content"];
	        this.fileName = source["fileName"];
	        this.deleteFileName = source["deleteFileName"];
	        this.featureImage = this.convertValues(source["featureImage"], domain.FileInfo);
	        this.featureImagePath = source["featureImagePath"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class RendererFacade {
	
	
	    static createFrom(source: any = {}) {
	        return new RendererFacade(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class TagCascadeResult {
	    tags: domain.Tag[];
	    posts: domain.Post[];
	
	    static createFrom(source: any = {}) {
	        return new TagCascadeResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tags = this.convertValues(source["tags"], domain.Tag);
	        this.posts = this.convertValues(source["posts"], domain.Post);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TagForm {
	    name: string;
	    slug: string;
	    color: string;
	    originalName: string;
	
	    static createFrom(source: any = {}) {
	        return new TagForm(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.slug = source["slug"];
	        this.color = source["color"];
	        this.originalName = source["originalName"];
	    }
	}
	export class UpdateInfo {
	    hasUpdate: boolean;
	    currentVersion: string;
	    latestVersion: string;
	    publishedAt: string;
	    htmlUrl: string;
	    body: string;
	    bodyHtml: string;
	    hasAsset: boolean;
	    assetName: string;
	    assetSize: number;
	
	    static createFrom(source: any = {}) {
	        return new UpdateInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hasUpdate = source["hasUpdate"];
	        this.currentVersion = source["currentVersion"];
	        this.latestVersion = source["latestVersion"];
	        this.publishedAt = source["publishedAt"];
	        this.htmlUrl = source["htmlUrl"];
	        this.body = source["body"];
	        this.bodyHtml = source["bodyHtml"];
	        this.hasAsset = source["hasAsset"];
	        this.assetName = source["assetName"];
	        this.assetSize = source["assetSize"];
	    }
	}

}

