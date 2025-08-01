# Project Setup and Troubleshooting Summary

## Actions Taken

1. **Configured GitHub Pages Remote Theme**

   - Verified `_config.yml` includes `remote_theme: "redackee/beautiful-jekyll"`.
   - Confirmed correct usage for GitHub Pages and Jekyll.

2. **Created Gemfile for Local Development**

   - Added a `Gemfile` with:
     ```ruby
     gem 'github-pages', group: :jekyll_plugins
     ```
   - Noted that `jekyll-remote-theme` is already included via `github-pages`.

3. **Attempted Local Gem Installation**

   - Ran `bundle install --path vendor/bundle` to install gems locally.
   - Encountered permission errors and native extension build errors (e.g., `commonmarker`).

4. **Troubleshooting Steps**

   - Advised to remove and retry `vendor/bundle` if permissions are an issue.
   - Recommended installing Xcode Command Line Tools with `xcode-select --install` for native gem builds.
   - Provided instructions for installing Ruby locally using Homebrew, rbenv, or rvm to avoid system Ruby permission issues.

5. **Documentation Provided**

   - Linked to the official [`jekyll-remote-theme` documentation](https://github.com/benbalter/jekyll-remote-theme).
   - Summarized installation and configuration steps for remote themes and local development.

6. **Ruby Version Management**

   - Installed `rbenv` locally using Homebrew.
   - Set up Ruby version 3.4.5 for local development.

7. **Previewing the Website Locally**
   - To preview your site locally with the correct plugins and theme, run:
     ```sh
     bundle exec jekyll serve
     ```
   - Then open http://localhost:4000 in your browser.

---

For further troubleshooting, ensure you are using a user-managed Ruby and have the necessary build tools installed. All configuration and setup steps are now documented in this summary.
