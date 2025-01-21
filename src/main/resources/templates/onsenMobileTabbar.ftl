<#if !error>
    <ons-tabbar id="onsenTabbar" position="bottom" animation="none" <#if swipeable == "true">swipeable</#if>>
        <#list menuList as menu>
            <ons-tab href="${menu['url']}" page="template_${menu['menuId']}.html" id="template_${menu['menuId']}" label="${menu['label']}" <#if menu['icon']?has_content>${menu['icon']}</#if> <#if menu['active']?has_content>${menu['active']}</#if>>
            </ons-tab>
        </#list>
    </ons-tabbar>
</#if>
