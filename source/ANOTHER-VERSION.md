# Another version

Open an article → Article settings → **Another version** → **Add another version**.
Choose a language and write the translated title and Markdown. Save or publish the article to save all versions together. An empty title uses the original title. An empty body stays saved but is not published as a language option.

The Simple theme shows compact language links below the date. The original keeps its existing URL; translations use `/post/<slug>/versions/<language>/`. Switching uses the existing sidebar-preserving navigation. Each version renders its own Markdown, math, word count, and headings. No translation service, server, or API key is required.

Translations are stored in the article's YAML `versions` array, separate from its original Markdown body. Supported editor choices: English, simplified/traditional Chinese, Japanese, Korean, French, German, Spanish, Portuguese, Russian, Italian. Removing a nonempty version asks for confirmation and takes effect when the article is saved and the site is regenerated.

Validation: domain, repository, engine and facade tests passed; production frontend and Windows executable builds passed. Tested saved Markdown containing `---`, round-trip persistence, removal, duplicate/invalid language codes, custom post paths, blank translations and math. Browser checked original → English → Japanese navigation. Existing full-project TypeScript errors remain in CustomSetting.vue and PersonalizationSetting.vue; no errors reported for the added feature.

The previous executable is backed up in `../backups/before-another-version-20261112/`.
