    <#list userview.categories as category>
            <#if category.properties.hide! != 'yes' && category.menus?size gt 0>
                ${category_before!}
                <#assign cClass = category_classes!>
                <#if category_index == 0>
                    <#assign cClass = cClass + " " + first_category_classes!>
                </#if>
                <#if (category_index + 1) == userview.categories?size>
                    <#assign cClass = cClass + " " + last_category_classes!>
                </#if>
                <#if userview.currentCategory?? && category.properties.id == userview.currentCategory.properties.id>
                    <#assign cClass = cClass + " " + current_category_classes!>
                </#if>
                <#assign firstMenu = category.menus[0]>
                <#if combine_single_menu_category! && category.menus?size == 1>
                    <ons-list-item id="${firstMenu.properties.id}" class="${cClass}" tappable onclick="fn.loadMenu(this)>
                        ${category_inner_before!}
                        ${theme.decorateMenu(category, firstMenu)}
                        ${category_inner_after!}
                    </ons-list-item>
                <#else>
                    <ons-list-title>${theme.decorateCategoryLabel(category)}</ons-list-title>
                    <ons-list id="default-category-list">
                            <#list category.menus as menu>
                                <#assign mClass = menu_classes!>
                                <#if menu_index == 0>
                                    <#assign mClass = mClass + " " + first_menu_classes!>
                                </#if>
                                <#if (menu_index + 1) == category.menus?size>
                                    <#assign mClass = mClass + " " + last_menu_classes!>
                                </#if>
                                <#if userview.current?? && menu.properties.id == userview.current.properties.id>
                                    <#assign mClass = mClass + " " + current_menu_classes!>
                                </#if>
                                ${menu_before!}
                                <ons-list-item id="${menu.properties.id!}" class="${mClass}" tappable onclick="fn.loadMenu(this)">
                                    ${menu_inner_before!}
                                    ${theme.decorateMenu(category, menu)}
                                    ${menu_inner_after!}
                                </ons-list-item>
                                ${menu_after!}
                            </#list>
                    </ons-list>
                </#if>
                ${category_after!}
            </#if>
        </#list>