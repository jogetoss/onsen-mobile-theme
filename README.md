# Onsen Mobile Theme

## Introduction
Onsen Mobile Theme are built with [Onsen UI](https://onsen.io/). It is a powerful framework for building mobile and hybrid applications using HTML, CSS, and JavaScript. 

## Installation
To get started, you'll need to have Joget installed with a version of at least 8.1.

## Getting Started
Once you've installed Joget of at least version 8.1, you can start using it in UI builder by selecting this as your application theme.

## Components and Usage
Onsen UI provides a variety of UI components that you can use to build your application. Refer to the documentation for a complete list of components and their usage:

### 1. Toolbar
**Purpose**:  
The toolbar provides a consistent layout structure across different pages or views within your mobile application. It typically contains elements such as a title, navigation buttons, action buttons, and other relevant controls.

**Components**:
1. Title: The main title of the page or view. It helps users understand the context of the current screen.  
2. Buttons: Navigation buttons for navigating between different views or performing specific actions within the app.   
3. Action Icons: Additional icons or buttons for performing actions such as refreshing content, adding items, or accessing settings.  

**Usage**:  
To use the toolbar in your Joget application, it will automatically apply at the top of the page when you are using this theme.

**Related configuration**:  
[Toolbar Design](#configuration)

***

### 2. Tabbar
**Purpose**:  
The Tabbar provides a way to organize and navigate between multiple sections or views within an application. It appears at the bottom of the screen, offering quick access to different sections of the app.

**Components**:
1. Tabs: Each tab represents a different section or view of the application. Users can tap on tabs to switch between them.
2. Icons: Tabs often include icons to visually represent the content of each section. Icons help users quickly identify the purpose of each tab.
3. Labels: Optional text labels can accompany tab icons to provide additional context or information about each section.

**Usage**:  
To use the Tabbar in your Joget application, configure it in the UI builder. First, select the userview, then in the tab settings, choose the userview category. The Tabbar will populate based on the categories you've added. Icons and labels will follow the userview category settings. Note that for labels, only the first word will be taken, for example, 'Manage Meeting' will display 'Manage' as the label.

**Related configuration**:  
[UI Builder](#configuration)  
[Tab Bar Swipeable](#configuration)  
[Tab(s) Setting](#configuration)  

***

### 3. Inner Tabbar
**Purpose**:  
Like all Tabbars, the Inner Tabbar is designed to help users navigate between different sections or views within a mobile or hybrid application.

Positioning at the Top of the Screen:
1. Unlike other Tabbars that might appear at the bottom of the screen, the Inner Tabbar specifically appears at the top.
2. This positioning choice offers users quick access to navigation options while maximizing screen space for content.
3. The Inner Tabbar will automatically slide horizontally when there are many tabs.

**Components**:  
Similar to Tabbars, the Inner Tabbar consists of tabs, icons, labels.
1) Tabs represent distinct sections or views within the application.
2) Icons provide visual cues to help users identify each tab's purpose.
3) Labels offer textual information about each tab.

**Usage**:  
To use the Inner Tabbar in your Joget application, configure it in the UI builder. First, ensure that your selected userview category has more than one UI Menu. The Inner Tabbar will then automatically generate the inner tabs based on the UI Menus and icons are not allowed here.

**Related configuration**:  
[UI Builder](#configuration)   
[Tab(s) Setting](#configuration)  

***

### 4. Pull down to Refresh
**Purpose**:
Pull to Refresh provides users with a convenient way to update the content of a page or view without needing to navigate away or manually trigger a refresh action. It's commonly used in mobile and web applications to refresh lists, feeds, or other dynamic content.

**Components**:
1. Refresh Indicator: A visual cue, often in the form of an animated icon or text, indicating that the user can pull down to refresh the content.
2. Threshold: The distance the user needs to pull down before the refresh action is triggered. Once the user exceeds this threshold, the refresh process begins.
3. Loading Animation: An animation displayed during the refresh process, indicating that the content is being updated.
4. Updated Content: Once the refresh is complete, the updated content replaces the old content on the page.

**Usage**:  
It will automatically add the pull event to the page when the page is loaded. To use it, simply pull down the page, and it will reload automatically.

***

### 5. Splitter (Side Menu)
**Purpose**:  
The splitter component enables the creation of multi-panel layouts, allowing developers to divide the screen into resizable or collapsible sections. It's particularly useful for creating responsive designs and improving user experience by providing flexibility in how content is displayed.

**Components**:  
1. Splitter Content: The main content area of the layout, typically containing the primary content or application views.
2. Splitter Side: An optional panel that can be positioned to the left or right of the content area, often used for navigation menus or secondary content.
3. Handle: The draggable handle that separates the content and side panels, allowing users to resize or collapse the panels as needed.

**Usage**:  
The Splitter will be automatically generated and will follow the sequence and settings of the side menu.

**Related configuration**:  
[Side Menu Animation](#configuration)  
[Side Menu Width](#configuration)  
[Side Menu Swipeable](#configuration)  
[Side Menu Swiper Target Width](#configuration)  

<a name="configuration"></a>
## Configuration  
**Toolbar Design(option)**:  
Standard Mode - Open side menu button on left, title at center, other action button at the right.  
Left Mode - title on left,  action buttons at the right and following with open side menu button.

**Side Menu Animation(option)**:  
Reveal Animation:  
The "reveal" animation is a visual effect where the side panel gradually becomes visible by sliding out from behind the main content area. When triggered, the side panel smoothly reveals itself, giving users the impression that it was hidden off-screen and is now being brought into view. This animation creates a seamless transition between the hidden and visible states of the side panel, enhancing the overall user experience.

Slide In Animation:  
The "slide in" animation is a visual effect where the side panel slides into view from the edge of the screen. When triggered, the side panel smoothly slides into view, starting from outside the visible area and moving towards the main content area. This animation provides users with a clear indication of the side panel's movement and destination, making it easier to understand its purpose and relation to the main content.

**Side Menu Width(textfield)**:  
Set the side menu width in px.

**Side Menu Swipeable(checkbox)**:  
The "swipeable" feature for a Side Menu allows users to open the Side Menu by swiping horizontally on a device.

**Side Menu Swiper Target Width(textfield)**:  
Refers to the width of the area within the splitter component that is targeted for swipe navigation. 

**Tab Bar Swipeable(checkbox)**:  
Allows users to navigate between different tabs by swiping horizontally on a device.

**UI Builder(option)**:  
List of UI builder, this is to service the tab settings below

**Tab(s) Setting(column)s**:  
Add the userview category you want to display in the tab bar.

## Theming
You can customize the appearance of DX8 Onsen Mobile theme using the following color settings:

- **Background**: Sets the background color of the application.
- **Content Background**: Specifies the color of the content area within the application.
- **Toolbar Background**: Defines the background color of the toolbar, which also applies to the Inner Tabbar.
- **Toolbar Button Color**: Sets the color of toolbar buttons and text in their normal state, applied to both the toolbar and Inner Tabbar.
- **Toolbar Active Color**: Determines the color of toolbar buttons and text when in the active state, applied to both the toolbar and Inner Tabbar.
- **Tabbar Background**: Sets the background color of the Tabbar.
- **Tabbar Text Color**: Specifies the color of text in the Tabbar in its normal state.
- **Tabbar Active Text Color**: Specifies the color of text in the Tabbar when in the active state.

# Getting Help

JogetOSS is a community-led team for open source software related to the [Joget](https://www.joget.org) no-code/low-code application platform.
Projects under JogetOSS are community-driven and community-supported.
To obtain support, ask questions, get answers and help others, please participate in the [Community Q&A](https://answers.joget.org/).

# Contributing

This project welcomes contributions and suggestions, please open an issue or create a pull request.

Please note that all interactions fall under our [Code of Conduct](https://github.com/jogetoss/repo-template/blob/main/CODE_OF_CONDUCT.md).

# Licensing

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

NOTE: This software may depend on other packages that may be licensed under different open source licenses.
