${main_container_before!}
<div id="${main_container_id!}" class="${main_container_classes!}">
    <div class="${main_container_inner_classes!}">
        ${main_container_inner_before!}
        <#if !embed && !hide_nav>
            ${sidebar_before!}
            <div id="${sidebar_id!}" class="${sidebar_classes!}">
                ${sidebar_inner_before!}
                ${menus!}
                ${sidebar_inner_after!}
            </div>
            ${sidebar_after!}
        </#if>
        ${content_before!}
        ${toolbar!}
        ${content_after!}
        ${splitter!}
        ${templates!}
        ${main_container_inner_before!}
    </div>
</div>
<div class="temp-loaded-container" style="display: none">
    <div class="temp-loaded-content">
        ${content!}
    </div>
</div>
${main_container_after!}