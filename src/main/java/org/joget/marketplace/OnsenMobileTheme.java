package org.joget.marketplace;

import de.bripkens.gravatar.DefaultImage;
import de.bripkens.gravatar.Gravatar;
import de.bripkens.gravatar.Rating;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringJoiner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.joget.apps.app.dao.UserviewDefinitionDao;
import org.joget.apps.app.model.AppDefinition;
import org.joget.apps.app.model.UserviewDefinition;
import org.joget.apps.app.service.AppPluginUtil;
import org.joget.apps.app.service.AppService;
import org.joget.apps.app.service.AppUtil;
import org.joget.apps.userview.lib.AjaxUniversalTheme;
import org.joget.apps.userview.model.Userview;
import org.joget.apps.userview.model.UserviewCategory;
import org.joget.apps.userview.model.UserviewMenu;
import org.joget.apps.userview.service.UserviewUtil;
import org.joget.commons.util.LogUtil;
import org.joget.commons.util.ResourceBundleUtil;
import org.joget.commons.util.StringUtil;
import org.joget.commons.util.TimeZoneUtil;
import org.joget.directory.model.User;
import org.joget.directory.model.service.DirectoryUtil;
import org.joget.plugin.base.PluginManager;
import org.joget.workflow.model.WorkflowAssignment;
import org.joget.workflow.model.service.WorkflowManager;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.context.ApplicationContext;

public class OnsenMobileTheme extends AjaxUniversalTheme{
    private final static String MESSAGE_PATH = "messages/onsenMobileTheme";
    
    @Override
    public String getName() {
        return "Onsen Mobile Theme";
    }

    @Override
    public String getVersion() {
        return "8.0.1";
    } 

    @Override
    public String getLabel() {
        return getName();
    }

    @Override
    public String getDescription() {
        return "Onsen Mobile theme is a mobile theme that enables developers to create cross-platform mobile applications with a native look and feel.";
    }
    
    @Override
    public String getClassName() {
        return getClass().getName();
    }
    
    @Override
    public String getPropertyOptions() {
        AppDefinition appDef = AppUtil.getCurrentAppDefinition();
        String id = appDef.getAppId();
        String version = Long.toString(appDef.getVersion());
        return AppUtil.readPluginResource(getClass().getName(), "/properties/onsenMobileTheme.json", new String[]{id, version}, true, MESSAGE_PATH);
    }
    
    @Override
   protected String getNavbar(Map<String, Object> data) {
        String html = "<div class=\"nav-no-collapse header-nav\"><ul class=\"nav pull-right\">\n";
        html += getHomeLink(data);
        if ((Boolean) data.get("is_logged_in")) {
            html += getInbox(data);
        }
        html += getShortcut(data);
        if ("true".equals(getPropertyString("darkMode"))) {
            html += getThemeSwitch(data);
        }
        html += getUserMenu(data);
        html += "</ul></div>\n";
        return html;
    }
   
   @Override
    public String getJsCssLib(Map<String, Object> data) {
        if (isAjaxContent(data)) {
            return "";
        } else {
            String jsCssLink = super.getJsCssLib(data);
            jsCssLink += "<script>"
                    + "var initialMessage = '" + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.pullToRefresh", getClassName(), MESSAGE_PATH) + "';"
                    + "var loadingMessage = '" + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.loading", getClassName(), MESSAGE_PATH) + "';"
                    + "var releaseMessage = '" + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.release", getClassName(), MESSAGE_PATH) + "';"
                    + "</script>";
            
            String path = data.get("context_path") + "/plugin/" + getClassName();
            
            jsCssLink += "<script src=\"" + path + "/js/onsenui.min.js\"></script>\n";
            jsCssLink += "<script src=\"" + path + "/js/onsenMobileCustom.js\"></script>\n";
            jsCssLink += "<link rel=\"stylesheet\" href=\"" + path + "/css/onsenui.min.css\"></link>\n";
            jsCssLink += "<link rel=\"stylesheet\" href=\"" + path + "/css/onsen-css-components.min.css\"></link>\n";
            jsCssLink += "<link rel=\"stylesheet\" href=\"" + path + "/css/ionicons/css/ionicons.min.css\"></link>\n";
            jsCssLink += "<link rel=\"stylesheet\" href=\"" + path + "/css/onsenMobileCustom.css\"></link>\n";

            jsCssLink += getInternalJsCssLib(data);
            return jsCssLink;
        }
    }
    
    @Override
    public Set<String> getOfflineStaticResources() {
        Set<String> urls = super.getOfflineStaticResources();
        String contextPath = AppUtil.getRequestContextPath();
        urls.add(contextPath + "/plugin/" + getClassName() + "/themes/css/onsenMobileCustom.css");
        urls.add(contextPath + "/plugin/" + getClassName() + "/themes/js/onsenMobileCustom.js");
        return urls;
    }
    
    @Override
    public String getHeader(Map<String, Object> data) {
        return "<ons-navigator swipeable id=\"onsen-navigator\" page=\"template_splitter.html\"></ons-navigator>";
    }

    @Override
    public String getMenus(Map<String, Object> data) {
        return "";
    }
    
    public String getToolbar(Map<String, Object> data) {
        String toolbarDesign = getPropertyString("toolbarDesign");
        // Check if toolbar design is "titleOnLeft"
        if (toolbarDesign.equalsIgnoreCase("titleOnLeft")) {
            // Construct toolbar HTML with title on the left
            toolbarDesign = "<ons-toolbar>\n"
                    + "        <div class=\"left\"><span class=\"toolbar__title\"></span></div>\n"
                    + "        <div class=\"center\"></div>\n"
                    + "        <div class=\"right title-on-right\">\n"
                    +               getHomeLink(data)
                    +               getInbox(data)
                    + "         <ons-toolbar-button onclick=\"fn.open()\">\n"
                    + "          <ons-icon icon=\"ion-ios-menu, material:md-more-vert\"></ons-icon>\n"
                    + "         </ons-toolbar-button>" 
                    + "        </div>\n"
                    + "      </ons-toolbar>\n";
        } else {
            // Construct toolbar HTML with title on the center (standard)
            toolbarDesign = "<ons-toolbar>\n"
                    + "        <div class=\"left\">\n"
                    + "          <ons-toolbar-button onclick=\"fn.open()\">\n"
                    + "          <ons-icon icon=\"ion-ios-menu, material:md-more-vert\"></ons-icon>\n"
                    + "        </ons-toolbar-button>"
                    + "        </div>\n"
                    + "        <div class=\"center\"><span class=\"toolbar__title\"></span></div>\n"
                    + "        <div class=\"right\">\n"
                    +               getHomeLink(data)
                    +               getInbox(data)
                    + "         </div>\n"
                    + "      </ons-toolbar>\n";
        }
        return toolbarDesign;
    }
    
    public String getTabBar(Map<String, Object> data) {
        String html = "";
        Map dataModel = new HashMap();
        Collection<Map<String, String>> tabBars = getTabList(data);
        
        // Reverse tab bars if layout direction is RTL
        if (AppUtil.isRTL()) {
            ArrayList<Map<String, String>> list = new ArrayList<>(tabBars);
            Collections.reverse(list);
            tabBars = new ArrayList<>(list);
        }
        
        if (tabBars != null && !tabBars.isEmpty()) {
            String swipeable = getPropertyString("tabBarSwipeable");
            dataModel.put("swipeable", swipeable);
            dataModel.put("error", false);
            dataModel.put("menuList", tabBars);
            dataModel.put("isRTL", AppUtil.isRTL());
            PluginManager pluginManager = (PluginManager) AppUtil.getApplicationContext().getBean("pluginManager");
            html = pluginManager.getPluginFreeMarkerTemplate(dataModel, getClassName(), "/templates/onsenMobileTabbar.ftl", null);
        }
        return html;
    }
    
    public String getSplitter(Map<String, Object> data) {
        String splitterMode = getPropertyString("sideMenuAnimation");
        String toolbarDesign = getPropertyString("toolbarDesign");
        
        // Handle toolbar design based on layout direction
        if (toolbarDesign.equalsIgnoreCase("titleOnLeft")) {
            toolbarDesign = AppUtil.isRTL() ? "side=\"left\" " : "side=\"right\" ";
        } else {
            toolbarDesign = AppUtil.isRTL() ? "side=\"right\" " : "side=\"left\" ";
        }
        
        // Handle splitter animation mode
        if (!splitterMode.isEmpty()) {
            splitterMode = "animation=\"" + splitterMode + "\" ";
        }
        String sideMenuWidth = getPropertyString("sideMenuWidth");
        String swipeable = "";
        String swiperTargetWidth = "";
        
        // Handle side menu swipeable behavior
        if ("true".equalsIgnoreCase(getPropertyString("sideMenuSwipeable"))) {
            swipeable = "swipeable ";

            swiperTargetWidth = getPropertyString("swipeTargetWidth");
            if (!swiperTargetWidth.isEmpty()) {
                swiperTargetWidth = "swipe-target-width=\"" + swiperTargetWidth + "\" ";
            }
        }
        
        // Add the navi-page template
        addTemplate(data, "navi-page", true, false, null);
        
        // Construct the HTML for the splitter
        return "<template id=\"template_splitter.html\">\n"
                + "  <ons-page id=\"template_Splitter\">\n"
                + "    <ons-splitter>\n"
                + "      <ons-splitter-side id=\"menu\" " + swipeable + " width=\""+ sideMenuWidth + "\" collapse " + swiperTargetWidth + splitterMode + toolbarDesign +">\n"
                + "        <ons-page>\n"
                +           getSidebarUserMenu(data) 
                +           UserviewUtil.getTemplate(this, data, "/templates/onsenMobileMenus.ftl")
                +           getLogoutLink(data)
                + "        </ons-page>\n"
                + "      </ons-splitter-side>\n"
                + "      <ons-splitter-content id=\"main-content\" page=\"template_default.html\"></ons-splitter-content>\n"
                + "     </ons-splitter>"
                + "  </ons-page>\n"
                + "</template>";
    }
    
    protected String getLogoutLink(Map<String, Object> data) {
        String html = "";
        if ((Boolean) data.get("is_logged_in")) {
            html += "<ons-list-title></ons-list-title>"
                    + "<ons-list class=\"logout\" id=\"links\">\n"
                    + "    <ons-list-item tappable style=\"cursor: pointer\">\n"
                    + "     <a class=\"loginLink\" href=\"" + data.get("logout_link") + "\">"
                    + "         <span>" + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.logout", getClassName(), MESSAGE_PATH) + "</span>" + "\n"
                    + "     </a>"
                    + "    </ons-list-item>\n"
                    + "</ons-list>"
                    + "<ons-list-title></ons-list-title>";
        }
        return html;
    }
    
    @Override
    protected String getSidebarUserMenu(Map<String, Object> data) {
        String html = "";
        String profileLink = "";
        if ((Boolean) data.get("is_logged_in")) {
            User user = (User) data.get("user");
            String email = user.getEmail();
            if (email == null) {
                email = "";
            }
            if (email.contains(";")) {
                email = email.split(";")[0];
            }
            if (email.contains(",")) {
                email = email.split(",")[0];
            }

            String profileImageTag = "";
            if (getPropertyString("userImage").isEmpty()) {
                String url = (email != null && !email.isEmpty())
                        ? new Gravatar()
                                .setSize(20)
                                .setHttps(true)
                                .setRating(Rating.PARENTAL_GUIDANCE_SUGGESTED)
                                .setStandardDefaultImage(DefaultImage.IDENTICON)
                                .getUrl(email)
                        : "//www.gravatar.com/avatar/default?d=identicon";
                profileImageTag = "<img class=\"gravatar\" alt=\"gravatar\" width=\"30\" height=\"30\" data-lazysrc=\"" + url + "\" onError=\"this.onerror = '';this.style.display='none';\"/> ";
            } else if ("hashVariable".equals(getPropertyString("userImage"))) {
                String url = AppUtil.processHashVariable(getPropertyString("userImageUrlHash"), null, StringUtil.TYPE_HTML, null, AppUtil.getCurrentAppDefinition());
                if (AppUtil.containsHashVariable(url) || url == null || url.isEmpty()) {
                    url = data.get("context_path") + "/" + getPathName() + "/user.png";
                }
                profileImageTag = "<img alt=\"profile\" width=\"30\" height=\"30\" src=\"" + url + "\" /> ";
            }

            if (!"true".equals(getPropertyString("profile")) && !user.getReadonly()) {
                profileLink = data.get("base_link") + PROFILE;
            }
            
            // Add the profile template
            addTemplate(data, "profile", true, false, null);
            
            // Construct HTML for the user menu
            html += "<ons-list-title>" + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.myProfile", getClassName(), MESSAGE_PATH) + "</ons-list-title>"
                    + "<ons-list class=\"usermenu\" id=\"links\">\n"
                    + "    <ons-list-item tappable style=\"cursor: pointer\"\n"
                    + "      onclick=\"fn.loadProfile(this)\"\n"
                    + "      href=\""+ profileLink + "\""
                    + "      title=\"" + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.myProfile", getClassName(), MESSAGE_PATH) + "\">"
                    + "      <div class=\"left\">\n"
                    + "        " + profileImageTag + "\n"
                    + "      </div>\n"
                    + "      <div class=\"center\">\n"
                    + "         <span>" + StringUtil.stripHtmlTag(DirectoryUtil.getUserFullName(user), new String[]{}) + "</span>\n"
                    + "         <small>" + email + "</small>\n"
                    + "      </div>\n"
                    + "    </ons-list-item>\n"
                    + "  </ons-list>";
        } else {
            String profileImageTag = "";
            if (getPropertyString("userImage").isEmpty() || "hashVariable".equals(getPropertyString("userImage"))) {
                String url = data.get("context_path") + "/" + getPathName() + "/user.png";
                profileImageTag = "<img alt=\"profile\" width=\"30\" height=\"30\" src=\"" + url + "\" /> ";
            }
            
            // Construct HTML for the user menu when not logged in
            html += "<ons-list-title>" + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.myProfile", getClassName(), MESSAGE_PATH) + "</ons-list-title>\n"
                    + "  <ons-list class=\"usermenu\" id=\"links\">\n"
                    + "    <ons-list-item tappable style=\"cursor: pointer\" modifier=\"longdivider chevron\" onclick=\"fn.load('" + data.get("login_link") + "')\">\n"
                    + "      <div class=\"left\">\n"
                    + "        " + profileImageTag + "\n"
                    + "      </div>\n"
                    + "      <div class=\"center\">\n"
                    + "        " + ResourceBundleUtil.getMessage("ubuilder.login") + "\n"
                    + "      </div>\n"
                    + "    </ons-list-item>\n"
                    + "  </ons-list>";
        }
        return html;
    }
    
    @Override
    protected String getInbox(Map<String, Object> data) {
        String html = "";
        if ((Boolean) data.get("is_logged_in")) {
            addTemplate(data, "inbox", true, false, null);
            html = "<ons-toolbar-button id=\"inbox-button\" title=\"" + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.inbox", getClassName(), MESSAGE_PATH) + "\" href=\"" + data.get("base_link") + INBOX + "\">"
                    + "         <ons-icon icon=\"md-notifications-none\" badge=\"0\">"
                    + "         </ons-icon>"
                    + "     </ons-toolbar-button>\n";
        }
        return html;
    }
    
    @Override
    protected String getHomeLink(Map<String, Object> data) {
        String home_page_link = data.get("context_path").toString() + "/home";
        if (!getPropertyString("homeUrl").isEmpty()) {
            home_page_link = getPropertyString("homeUrl");
        }
        return "<ons-toolbar-button id=\"home-button\" onclick=\"fn.load('" + home_page_link + "')\">"
                + "         <ons-icon icon=\"md-home\" badge=\"0\">"
                + "         </ons-icon>"
                + "     </ons-toolbar-button>\n";
    }
    
    /**
     * Converts a list of strings into a single string with elements separated
     * by a delimiter.
     *
     * @param list The list of strings to convert.
     * @return A string containing elements of the list separated by the
     * delimiter.
     */
    public static String listToString(List<String> list) {
        StringJoiner joiner = new StringJoiner(";");
        for (String element : list) {
            joiner.add(element);
        }
        return joiner.toString();
    }
    
    /**
     * Adds a template to the provided data.
     *
     * @param data The map containing template data.
     * @param id The ID of the template.
     * @param goBack Flag indicating whether to add a back button.
     * @param isHome Flag indicating whether the template is a home template.
     * @param innerTabList Collection of inner tab information (optional).
     */
    protected void addTemplate(Map<String, Object> data, String id, boolean goBack, boolean isHome, Collection<Map<String, String>> innerTabList) {
        // Retrieve templates collection from the provided data
        Collection<Map<String, Object>> templates = (Collection<Map<String, Object>>) data.get("templates");
        
        // Create new templates collection if it doesn't exist
        if (templates == null) {
            templates = new ArrayList<Map<String, Object>>();
        }
        
        Map<String, Object> template = new HashMap<String, Object>();
        template.put("templateId", id);
        template.put("addBackButton", String.valueOf(goBack));
        template.put("home", String.valueOf(isHome));
        
        // Add innerTabList to template map if provided
        if (innerTabList != null) {
            template.put("innerTab", innerTabList);
        }
        templates.add(template);
        
        data.put("templates", templates);
    }
    
    /**
     * Generates template strings based on the provided data.
     *
     * @param data The map containing template data.
     * @return A string containing generated templates.
     */
    protected String generateTemplates(Map<String, Object> data) {
        String templatesString = "";
        
        // Retrieve templates collection from the provided data
        Collection<Map<String, Object>> templates = (Collection<Map<String, Object>>) data.get("templates");
        if (templates != null) {
            for (Map<String, Object> template : templates) {
                // Retrieve template ID, back button flag, and home flag
                String id = (String) template.get("templateId");
                String backBtn = (String) template.get("addBackButton");
                String isHome = (String) template.get("home");
                
                String templateString;
                // Default content start with progress bar
                String content = "<ons-progress-bar indeterminate></ons-progress-bar><ons-progress-circular indeterminate></ons-progress-circular>\n";
                Collection<Map<String, Object>> innerTab = (Collection<Map<String, Object>>) template.get("innerTab");
               
                // Check if inner tab exist
                if (innerTab != null) {
                    // Reverse inner tab order if RTL
                    if (AppUtil.isRTL()) {
                        ArrayList<Map<String, Object>> list = new ArrayList<>(innerTab);
                        Collections.reverse(list);
                        innerTab = new ArrayList<>(list);
                    }
                    // Default tab bar content
                    content = " <ons-tabbar swipeable tab-border position=\"top\">\n";
                    for (Map<String, Object> tab : innerTab) {
                        String url = (String) tab.get("url");
                        String label = (String) tab.get("label");
                        String tabId = (String) tab.get("menuId");
                        String icon = (String) tab.get("icon");
                        String active = (String) tab.get("active");
                        
                        // Prepare icon attribute
                        if (icon != null && !icon.isEmpty()) {
                            icon = "icon=\"" + icon + "\" ";
                        }
                        // Prepare active attribute
                        if (active == null || active.isEmpty()) {
                            active = "";
                        }
                        // Append tabbar to template
                        content += "<ons-tab page=\"template_" + tabId + ".html\" href=\"" + url + "\" id=\"template_" + tabId + "\" label=\"" + label + "\"" + icon + active + ">\n"
                                + "</ons-tab>\n";
                    }
                    content += "  </ons-tabbar>";
                }
                
                // Replace content if template is home
                if (isHome.equalsIgnoreCase("true")) {
                    content = "<ons-pull-hook id=\"pull-hook\">\n"
                            + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.pullToRefresh", getClassName(), MESSAGE_PATH) + "\n"
                            + "</ons-pull-hook>";
                }
                
                // Build template string with or without back button
                if (backBtn.equalsIgnoreCase("true")) {
                    templateString = "<template id=\"template_" + id + ".html\">\n"
                            + "  <ons-page id=\"template_" + id + "\">\n"
                            + "      <ons-toolbar>\n"
                            + "        <div class=\"left\"><ons-back-button>" + AppPluginUtil.getMessage("org.joget.plugin.enterprise.onsenMobileTheme.back", getClassName(), MESSAGE_PATH) + "</ons-back-button></div>\n"
                            + "        <div class=\"center\"></div>\n"
                            + "      </ons-toolbar>\n"
                            +           content
                            + "  </ons-page>\n"
                            + "</template>";
                } else {
                    templateString = "<template id=\"template_" + id + ".html\">\n"
                            + "  <ons-page id=\"template_" + id + "\">\n"
                            +       content
                            + "  </ons-page>\n"
                            + "</template>";
                }
                templatesString += templateString;
            }
        }
        return templatesString; // Return the generated templates string
    }

    @Override
    public String getContentContainer(Map<String, Object> data) {
        if (((Boolean) data.get("embed")) || ((Boolean) data.get("hide_nav"))) {
            data.put("content_classes", "span12");
        } else {
            data.put("content_classes", "span10");
        }

        if (((Boolean) data.get("embed"))) {
            return super.getContentContainer(data);
        } else {
            addTemplate(data, "multiPurposeTemplate", true, false, null);
            String content = getTabBar(data);
            if (data.get("is_login_page").toString().equalsIgnoreCase("true")) {
                content = "<div id=\"content\" class=\"page_content\">\n"
                        + "<main>"
                        + data.get("content")
                        + "</main>\n";

            }
            data.put("main_container_inner_classes", "templates");
            data.put("content_before", "<template id=\"template_default.html\">\n"
                    + "<ons-page id=\"template_default\">");
            data.put("toolbar", getToolbar(data));
            data.put("content_after", content + "</ons-page></template>");
            data.put("splitter", getSplitter(data));
            data.put("templates", generateTemplates(data));
            return UserviewUtil.getTemplate(this, data, "/templates/onsenMobileContentContainer.ftl");
        }
    }

    @Override
    protected String getInternalJsCssLib(Map<String, Object> data) {
        String jscss = "";
        jscss += super.getInternalJsCssLib(data);
        if (!isAjaxContent(data) && !"true".equalsIgnoreCase(userview.getParamString("isPreview")) && !(data.get("is_login_page") != null && ((Boolean) data.get("is_login_page"))) && !(data.get("is_popup_view") != null && ((Boolean) data.get("is_popup_view")))) {
            jscss += "\n<script>" + getContentPlaceholderRules() + "</script>";
        }
        return jscss;
    }
    
    protected String getIconFromLabel(String label) {
        String icon = "";
        if (label.contains("aria-hidden=\"true\"")) {
            label = label.replace(" aria-hidden=\"true\"", ""); // Remove "aria-hidden=\"true\""
        }

        String regex = "<i class=[\"']([^\"']+)[\"']></i>";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(label);
        // Find the matching pattern
        if (matcher.find()) {
            String iconClass = matcher.group(1);
            label = label.replace(matcher.group(0) + " ", "");
            int indexOfSpace = iconClass.indexOf(' ');
            // Check if a space exists and extract the word after it
            if (indexOfSpace != -1 && indexOfSpace < iconClass.length() - 1) {
                icon = iconClass.substring(indexOfSpace + 1);
                // Check if the icon class contains "zmdi" and replace it with "md-"
                if (icon.contains("zmdi")) {
                    icon = icon.replace("zmdi-", "md-");
                }
            }
        }
        return icon;
    }
    
    protected String removeIconFromLabel(String label) {
        if (label.contains("aria-hidden=\"true\"")) {
            label = label.replace(" aria-hidden=\"true\"", ""); // Remove "aria-hidden=\"true\""
        }

        String regex = "<i class=[\"']([^\"']+)[\"']></i>";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(label);
        // Find the matching pattern
        if (matcher.find()) {
            label = label.replace(matcher.group(0) + " ", "");
        }
        return label;
    }
    
    protected Collection<Map<String, String>> getTabList(Map<String, Object> data) {
        Collection<Map<String, String>> output = new ArrayList<Map<String, String>>();
        Object tabSettings = getProperty("tabSettings");
        int currentTab = 0;
        boolean isFirstMenu = true;
        if (tabSettings != null && !tabSettings.toString().isEmpty()) {
            for (Object colObj : (Object[]) tabSettings) {
                Map col = (Map) colObj;
                String tabId = (String) col.get("category");
                // Iterate through userview categories
                for (UserviewCategory cat : userview.getCategories()) {
                    if (cat.getPropertyString("id").equalsIgnoreCase(tabId)) {
                        String firstInnerTabUrl = "";
                        String firstInnerTabTemplate = "";
                        Collection<Map<String, String>> innerTabList = new ArrayList<Map<String, String>>();
                        int currentInnerTab = 0;
                        for (UserviewMenu menu : cat.getMenus()) {
                            Map<String, String> innerTab = new HashMap<String, String>();
                            String menuId = menu.getPropertyString("id");
                            String label = menu.getPropertyString("label");
                            String icon = getIconFromLabel(label);
                            label = removeIconFromLabel(label);
                            
                            String url = menu.getUrl();
                            
                            // Set first inner tab URL
                            if (firstInnerTabUrl.isEmpty()) {
                                firstInnerTabUrl = url;
                            }
                            
                            // Set first inner tab template
                            if (firstInnerTabTemplate.isEmpty()) {
                                firstInnerTabTemplate = menuId;
                            }
                            
                            // Populate inner tab information
                            innerTab.put("menuId", menuId);
                            innerTab.put("label", label);
                            innerTab.put("icon", icon);
                            innerTab.put("url", url);
                            
                            // Set active flag for the first inner tab
                            if (currentInnerTab == 0) {
                                innerTab.put("active", "active");
                            }
                            innerTabList.add(innerTab);
                            
                            // Add template for the menu
                            addTemplate(data, menuId, false, isFirstMenu, null);
                            isFirstMenu = false; // Set to false after the first iteration
                            currentInnerTab++; // Increment current inner tab index
                        }
                        // Check if there are more than one inner tab
                        if (innerTabList.size() > 1) {
                            // Retrieve category details for tab
                            String newTabID = cat.getPropertyString("id");
                            String categoryLabel = cat.getPropertyString("label");
                            String icon = getIconFromLabel(categoryLabel);
                            categoryLabel = removeIconFromLabel(categoryLabel);
                                    
                            addTemplate(data, newTabID, false, false, innerTabList);

                            Map<String, String> setting = new HashMap<>();
                            setting.put("url", firstInnerTabUrl);
                            setting.put("label", categoryLabel);
                            setting.put("menuId", newTabID);
                            setting.put("icon", " icon=\"" + icon + "\"");
                            if (currentTab == 0) {
                                setting.put("active", "active");
                            }
                            output.add(setting);
                        } else {
                            // If only one inner tab only, use the only one menu as tab
                            if (!innerTabList.isEmpty()) {
                                for (Map<String, String> innerTabItem : innerTabList) {
                                    String url = innerTabItem.get("url");
                                    String label = innerTabItem.get("label");
                                    String menuId = innerTabItem.get("menuId");
                                    String icon = innerTabItem.get("icon");
                                    
                                    Map<String, String> setting = new HashMap<>();
                                    setting.put("url", url);
                                    setting.put("label", label);
                                    setting.put("menuId", menuId);
                                    setting.put("icon", " icon=\"" + icon + "\"");
                                    if (currentTab == 0) {
                                        setting.put("active", "active");
                                    }
                                    output.add(setting);
                                }
                            }
                        }
                    }
                }
                currentTab++;
            }   
        }
        return output;
    }
    
    protected UserviewMenu findUserviewMenuInUserview(Userview userview, String menuId) {
        if(userview.getCurrent() != null){
            if (menuId.equals(userview.getCurrent().getPropertyString("customId")) || menuId.equals(userview.getCurrent().getPropertyString("id"))) {
                return userview.getCurrent();
            }
        }
        
        UserviewMenu selectedMenu = null;
        boolean found = false;
        Collection<UserviewCategory> categories = userview.getCategories();
        for (UserviewCategory category: categories) {
            Collection<UserviewMenu> menus = category.getMenus();
            for (UserviewMenu menu: menus) {
                if (menuId.equals(menu.getPropertyString("customId")) || menuId.equals(menu.getPropertyString("id"))) {
                    selectedMenu = menu;
                    found = true;
                    break;
                }
            }
            if (found) {
                break;
            }
        }
        return selectedMenu;
    }
    
    @Override
    public String getFooter(Map<String, Object> data) {
        return "";
    }
    
    @Override
    protected String generateLessCss() {
        String css = ":root{";
        if (!getPropertyString("dx8colorScheme").isEmpty()) {
            String[] colors = getPropertyString("dx8colorScheme").split(";");
            for (int i=0; i < colors.length; i++) {
                if (!colors[i].isEmpty()) {
                    css += "--theme-color"+(i+1)+":"+colors[i]+ ";";
                }
            }
        }
        if (!getPropertyString("dx8backgroundImage").isEmpty()) {
            css += "--theme-background-image:url('"+getPropertyString("dx8backgroundImage")+ "');";
        }
        if (!getPropertyString("dx8contentbackground").isEmpty()) {
            css += "--theme-content-background:"+getPropertyString("dx8contentbackground")+ ";";
        }
        if (!getPropertyString("dx8headerColor").isEmpty()) {
            css += "--theme-header:"+getPropertyString("dx8headerColor")+ ";";
        }
        if (!getPropertyString("dx8headerFontColor").isEmpty()) {
            css += "--theme-header-font:"+getPropertyString("dx8headerFontColor")+ ";";
        }
        if (!getPropertyString("dx8navBackground").isEmpty()) {
            css += "--theme-sidebar:"+getPropertyString("dx8navBackground")+ ";";
        }
        if (!getPropertyString("dx8navLinkColor").isEmpty()) {
            css += "--theme-sidebar-link:"+getPropertyString("dx8navLinkColor")+ ";";
        }
        if (!getPropertyString("dx8navLinkIcon").isEmpty()) {
            css += "--theme-sidebar-icon:"+getPropertyString("dx8navLinkIcon")+ ";";
        }
        if (!getPropertyString("dx8navBadge").isEmpty()) {
            css += "--theme-sidebar-badge:"+getPropertyString("dx8navBadge")+";";
        }
        if (!getPropertyString("dx8navBadgeText").isEmpty()) {
            css += "--theme-sidebar-badge-text:"+getPropertyString("dx8navBadgeText")+";";
        }
        if (!getPropertyString("dx8navScrollbarThumb").isEmpty()) {
            css += "--theme-nav-scrollbar-thumb:"+getPropertyString("dx8navScrollbarThumb")+ ";";
        }
        if (!getPropertyString("dx8buttonBackground").isEmpty()) {
            css += "--theme-button-bg:"+getPropertyString("dx8buttonBackground")+ ";";
        }
        if (!getPropertyString("dx8buttonColor").isEmpty()) {
            css += "--theme-button:"+getPropertyString("dx8buttonColor")+ ";";
        }
        if (!getPropertyString("dx8primaryColor").isEmpty()) {
            css += "--theme-primary:"+getPropertyString("dx8primaryColor")+ ";";
        }
        if (!getPropertyString("dx8headingBgColor").isEmpty()) {
            css += "--theme-heading-bg:"+getPropertyString("dx8headingBgColor")+ ";";
        }
        if (!getPropertyString("dx8headingFontColor").isEmpty()) {
            css += "--theme-heading-color:"+getPropertyString("dx8headingFontColor")+ ";";
        }
        if (!getPropertyString("dx8fontColor").isEmpty()) {
            css += "--theme-font-color:"+getPropertyString("dx8fontColor")+ ";";
        }
        if (!getPropertyString("dx8contentFontColor").isEmpty()) {
            css += "--theme-content-color:"+getPropertyString("dx8contentFontColor")+ ";";
        }
        if (!getPropertyString("dx8linkColor").isEmpty()) {
            css += "--theme-link:"+getPropertyString("dx8linkColor")+ ";";
        }
        if (!getPropertyString("dx8linkActiveColor").isEmpty()) {
            css += "--theme-link-active:"+getPropertyString("dx8linkActiveColor")+ ";";
        }
        if (!getPropertyString("dx8background").isEmpty()) {
            css += "--background-color:"+getPropertyString("dx8background")+ " !important;";
            css += "--page-material-background-color:"+getPropertyString("dx8background")+ " !important;";
        }
        if (!getPropertyString("toolbarBackgroundColor").isEmpty()) {
            css += "--toolbar-background-color:"+getPropertyString("toolbarBackgroundColor")+ " !important;";
        }
        if (!getPropertyString("toolbarButtonColor").isEmpty()) {
            css += "--toolbar-button-color:"+getPropertyString("toolbarButtonColor")+ " !important;";
            css += "--toolbar-text-color:"+getPropertyString("toolbarButtonColor")+ " !important;";
            css += "--material-toolbar-button-color:"+getPropertyString("toolbarButtonColor")+ " !important;";
            css += "--material-toolbar-text-color:"+getPropertyString("toolbarButtonColor")+ " !important;";
        }
        if (!getPropertyString("toolbarBackgroundColor").isEmpty()) {
            css += "--toolbar-background-color:"+getPropertyString("toolbarBackgroundColor")+ " !important;";
            css += "--material-toolbar-background-color:"+getPropertyString("toolbarBackgroundColor")+ " !important;";
        }
        if (!getPropertyString("toolbarActiveColor").isEmpty()) {
            css += "--toolbar-active-color:"+getPropertyString("toolbarActiveColor")+ " !important;";
        }
        if (!getPropertyString("tabbarBackgroundColor").isEmpty()) {
            css += "--tabbar-background-color:"+getPropertyString("tabbarBackgroundColor")+ " !important;";
        }
        if (!getPropertyString("tabbarTextColor").isEmpty()) {
            css += "--tabbar-text-color:"+getPropertyString("tabbarTextColor")+ " !important;";
        }
        if (!getPropertyString("tabbarActiveColor").isEmpty()) {
            css += "--tabbar-active-color:"+getPropertyString("tabbarActiveColor")+ " !important;";
            css += "--material-tabbar-current-color:"+getPropertyString("tabbarActiveColor")+ " !important;";
        }
        if (!getPropertyString("listTitleColor").isEmpty()) {
            css += "--list-title-color:"+getPropertyString("listTitleColor")+ " !important;";
        }
        if (!getPropertyString("listTitleBackgroundColor").isEmpty()) {
            css += "--list-title-background-color:"+getPropertyString("listTitleBackgroundColor")+ " !important;";
        }
        css += "}";
        return css;        
    }
    
    public Map<String, String> getAllCategory(String userviewId, String appId, String version) {
        Map<String, String> result = new HashMap();

        ApplicationContext ac = AppUtil.getApplicationContext();
        AppService appService = (AppService) ac.getBean("appService");
        AppDefinition appDef = appService.getAppDefinition(appId, version);

        UserviewDefinitionDao userviewDefinitionDao = (UserviewDefinitionDao) AppUtil.getApplicationContext().getBean("userviewDefinitionDao");
        UserviewDefinition userviewDef = userviewDefinitionDao.loadById(userviewId, appDef);
        if (userviewDef != null) {
            String json = userviewDef.getJson();

            try {
                //set userview properties
                JSONObject userviewObj = new JSONObject(json);
                JSONArray categoriesArray = userviewObj.getJSONArray("categories");
                for (int i = 0; i < categoriesArray.length(); i++) {
                    JSONObject categoryObj = (JSONObject) categoriesArray.get(i);
                    JSONObject props = categoryObj.getJSONObject("properties");
                    String id = props.getString("id");
                    String label = props.getString("label");

                    result.put(id, label);
                }
            } catch (Exception e) {
                LogUtil.debug(getClass().getName(), "get userview category ids error.");
            }
        }
        return result;
    }
    
    @Override
    public void webService(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("_a");
        if (action == null || action.isEmpty()) {
            action = request.getParameter("action");
        }
        
        if ("getAssignment".equals(action)) {
            try {
                String appId = request.getParameter("appId");
                WorkflowManager wm = (WorkflowManager) AppUtil.getApplicationContext().getBean("workflowManager");
                if (appId != null && appId.isEmpty()) {
                    appId = null;
                }
                int count = wm.getAssignmentSize(appId, null, null);
                Collection<WorkflowAssignment> assignments = wm.getAssignmentListLite(appId, null, null, null, "a.activated", true, 0, 5);
        
                JSONObject jsonObj = new JSONObject();
                jsonObj.accumulate("count", count);
                
                String format = AppUtil.getAppDateFormat();
                Collection<Map<String, String>> datas = new ArrayList<Map<String, String>>();
                for (WorkflowAssignment a : assignments) {
                    Map<String, String> data = new HashMap<String, String>();
                    data.put("processId", a.getProcessId());
                    data.put("processDefId", a.getProcessDefId());
                    data.put("processRequesterId", a.getProcessRequesterId());
                    data.put("processName", a.getProcessName());
                    data.put("processVersion", a.getProcessVersion());
                    data.put("activityId", a.getActivityId());
                    data.put("activityDefId", a.getActivityDefId());
                    data.put("activityName", a.getActivityName());
                    data.put("assigneeName", a.getAssigneeName());
                    data.put("dateCreated", TimeZoneUtil.convertToTimeZone(a.getDateCreated(), null, format));
                    datas.add(data);
                }
                
                jsonObj.put("data", datas);

                jsonObj.write(response.getWriter());
            } catch (Exception ex) {
                LogUtil.error(this.getClass().getName(), ex, "Get assignment error!");
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            }
        } else if (action.equals("getCategory")) {
            
            JSONArray jsonArray = new JSONArray();
            Map blank = new HashMap();
            blank.put("value", "");
            blank.put("label", "");
            jsonArray.put(blank);
            
            String userviewId = request.getParameter("userviewId");
            String appId = request.getParameter("appId");
            String appVersion = request.getParameter("appVersion");
            Map<String, String> i = getAllCategory(userviewId, appId, appVersion);
            for (Map.Entry<String, String> entry : i.entrySet()) {
                Object key = entry.getKey();
                Object value = entry.getValue();

                blank = new HashMap();
                blank.put("value", key);
                blank.put("label", value);
                jsonArray.put(blank);
            }

            jsonArray.write(response.getWriter());
        } else {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
        }
    }
}