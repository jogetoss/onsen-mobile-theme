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

<template id="temp-loaded-container">
    <div class="temp-loaded-title">${title!}</div>
    <div class="temp-loaded-content">
        ${content!}
    </div>
</template>

${main_container_after!}