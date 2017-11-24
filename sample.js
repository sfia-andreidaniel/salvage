var sample = {
    "tpl": "/**\r\n * grid.isEnabled:                     {{grid.isEnabled}}\r\n *\r\n * grid.pageWidth:                     {{grid.pageWidth}}\r\n * grid.pageWidthWithoutPadding:       {{grid.pageWidthWithoutPadding}}\r\n * grid.columnWidth:                   {{grid.columnWidth}}\r\n * grid.columnSpacing:                 {{grid.columnSpacing}}\r\n * grid.spaceReservedForColumnSpacing: {{grid.spaceReservedForColumnSpacing}}\r\n * grid.paddingLeft:                   {{grid.paddingLeft}}\r\n * grid.paddingRight:                  {{grid.paddingRight}}\r\n * grid.paddingTop:                    {{grid.paddingTop}}\r\n * grid.paddingBottom:                 {{grid.paddingBottom}}\r\n */\r\n\r\n#form div[data-role=grid] {\r\n    padding-left: {{grid.paddingLeft}}px;\r\n    padding-right: {{grid.paddingRight}}px;\r\n}\r\n\r\n#form div[data-role=grid] > div[data-role=edge][data-edge=left] {\r\n    left: {{grid.paddingLeft}}px;\r\n}\r\n\r\n#form div[data-role=grid] > div[data-role=edge][data-edge=right] {\r\n    right: {{grid.paddingRight}}px;\r\n}\r\n\r\n#form div[data-role=grid] > div[data-role=edge][data-edge=top] {\r\n    top: {{grid.paddingTop}}px;\r\n}\r\n\r\n#form div[data-role=grid] > div[data-role=edge][data-edge=bottom] {\r\n    bottom: {{grid.paddingBottom}}px;\r\n}\r\n\r\n{{#if grid.isEnabled}}\r\n\r\n    #form div[data-role=grid] > div[data-role=col] {\r\n        width: {{grid.columnWidth}}px;\r\n        margin-right: {{grid.columnSpacing}}px;\r\n    }\r\n\r\n    #form div[data-role=grid] > div[data-role=col][data-index=\"1\"] {\r\n        margin-left: calc({{container.padding.horizontal}} + {{page.padding.left}} + 1px);\r\n    }\r\n\r\n    #form [data-role=control]:not([data-colspan]),\r\n    #form [data-role=container][data-type=likert-wrapper]:not([data-colspan]) {\r\n        width: {{grid.pageWidthWithoutPadding}}px;\r\n    }\r\n\r\n    #form [data-role=input-row] > *[data-size] + *[data-size] {\r\n        margin-left: {{grid.columnSpacing}}px !important;\r\n    }\r\n\r\n    #form[data-text-direction=rtl] [data-role=control]:not([data-force-mobile-rendering]) [data-role=input-row] > *[data-size] + *[data-size] {\r\n        margin-left: {{grid.columnSpacing}}px;\r\n    }\r\n\r\n    {{#each cols}}\r\n\r\n    /** EACH COLS **/    #form [data-colspan=\"{{colspan}}\"][data-role=control],\r\n        #form [data-colspan=\"{{colspan}}\"][data-role=container],\r\n        #form [data-colspan=\"{{colspan}}\"][data-role=virtual-form-table-row] {\r\n            width: {{width}}px;\r\n        }\r\n\r\n        #form [data-role=input-row][data-fill-colspan=\"{{colspan}}\"] > [data-size=fill] {\r\n            width: calc( {{width}}px - {{../grid.columnSpacing}}px );\r\n        }\r\n\r\n        {{#if additionalCSSClass}}\r\n\r\n        #form [data-role=input-row] > [data-size=\"{{additionalCSSClass}}\"] {\r\n            width: calc( {{width}}px - {{../grid.columnSpacing}}px);\r\n        }\r\n\r\n        {{#end}}\r\n\r\n        #form [data-colspan=\"{{colspan}}\"]:not([data-role=control]):not([data-role=container]):not([data-role=virtual-form-table-row]):not([data-role=page]) {\r\n            width: {{widthWithoutPadding}}px;\r\n            margin-right: {{../grid.columnSpacing}}px;\r\n        }\r\n\r\n        #form [data-role=control][data-label-width=\"{{colspan}}\"]:hover > [data-role=label-resizer],\r\n        #form [data-role=container][data-type=likert-wrapper][data-label-width=\"{{colspan}}\"]:hover > [data-role=label-resizer] {\r\n            left: calc({{width}}px - 1px);\r\n        }\r\n\r\n        #form [data-colspan=\"{{colspan}}\"] > [data-role=input-row] > [data-size=full] {\r\n            width: {{full}}px;\r\n        }\r\n\r\n        #form [data-colspan=\"{{colspan}}\"] > [data-role=input-row] > [data-size=half] {\r\n            width: {{half}}px;\r\n        }\r\n\r\n        #form [data-colspan=\"{{colspan}}\"] > [data-role=input-row] > [data-size=third] {\r\n            width: {{third}}px;\r\n        }\r\n\r\n        #form [data-colspan=\"{{colspan}}\"] > [data-role=input-row] > [data-size=quarter] {\r\n            width: {{quarter}}px;\r\n        }\r\n\r\n    {{#end}}\r\n\r\n{{#else}}   \r\n\r\n    #form div[data-role=grid] [data-role=col] {\r\n        display: none !important;\r\n    }\r\n\r\n    #form [data-role=control],\r\n    #form [data-role=container][data-type=likert-wrapper] {\r\n        width: {{grid.pageWidthWithoutPadding}}px;\r\n    }\r\n\r\n    #form [data-role=control] [data-role=input-row] > * + *:not([data-role=choice]) {\r\n        margin-top: {{input.margin.vertical}} !important;\r\n    }\r\n\r\n    #form [data-role=control] [data-role=input-row] > * + *:not(:last-child):not([data-role=choice]) {\r\n        margin-bottom: {{input.margin.vertical}} !important;\r\n    }\r\n\r\n{{#end}}\r\n\r\n#form {\r\n    background-color: {{form.background.color}};\r\n    font-family: {{form.font.family}};\r\n    font-size: {{form.font.size}};\r\n    {{#if form.background.image}}\r\n    background-image: url({{form.background.image}});\r\n    {{#if form.background.repeat}}background-repeat: {{form.background.repeat}}{{#else}}background-repeat: no-repeat{{#end}};\r\n    {{#if form.background.size}}background-size: {{form.background.size}};{{#end}}\r\n    {{#if form.background.position}}background-position: {{form.background.position}};{{#end}}\r\n    {{#if form.background.attachment}}background-attachment: {{form.background.attachment}};{{#end}}\r\n    {{#end}}\r\n}\r\n\r\nbody.with-notification #notifications-area {\r\n    background-color: {{form.background.color}} !important;\r\n}\r\n\r\n#form div[data-role=page],\r\n#form[data-submission-phase=show-html] > [data-submission-phase=show-html],\r\n#form div[data-role=detailed-invoice] {\r\n    width: calc({{grid.pageWidth}}px + {{page.border.width}} + {{page.border.width}});\r\n    padding: {{page.padding.top}} {{page.padding.right}} {{page.padding.bottom}} {{page.padding.left}};\r\n    background-color: {{page.background.color}};\r\n    border-width: {{page.border.width}};\r\n    border-style: {{page.border.style}};\r\n    border-color: {{page.border.color}};\r\n}\r\n\r\n{{#if page.background.image}}\r\n#form div[data-role=page] {\r\n    background-image: url({{page.background.image}});\r\n    {{#if page.background.repeat}}background-repeat: {{page.background.repeat}}{{#else}}background-repeat: no-repeat{{#end}};\r\n    {{#if page.background.size}}background-size: {{page.background.size}};{{#end}}\r\n    {{#if page.background.position}}background-position: {{page.background.position}};{{#end}}\r\n    {{#if page.background.attachment}}background-attachment: {{page.background.attachment}};{{#end}}\r\n}\r\n{{#end}}\r\n\r\n\r\n#form[data-has-fixed-header] div[data-role=page] [data-role=control][data-type=realtime-calculations],\r\n#form div[data-role=page] > div[data-role=page-header] > div[data-role=quiz-timer] {\r\n    width: calc({{grid.pageWidth}}px + {{page.border.width}} + {{page.border.width}});\r\n}\r\n\r\n#form div[data-role=page] > div[data-role=page-header] > div[data-role=pagination] {\r\n    margin-bottom: {{page.padding.top}};\r\n}\r\n\r\n#form div[data-role=page] > div[data-role=page-header] > div[data-role=quiz-timer] {\r\n    padding-right: calc( {{page.padding.right}} + {{container.padding.horizontal}} );\r\n}\r\n\r\n#form div[data-role=page] > div[data-role=page-header] > div[data-role=quiz-timer] {\r\n    margin-top: -{{page.padding.top}};\r\n    margin-left: -{{page.padding.left}};\r\n    margin-right: -{{page.padding.right}};\r\n}\r\n\r\n#form div[data-role=page] > div[data-role=page-header] > div[data-role=control][data-type=realtime-calculations] {\r\n    margin-top: -{{page.padding.top}};\r\n    margin-left: -{{page.padding.left}};\r\n}\r\n\r\n#form div[data-role=page] > div[data-role=page-header]:not([data-has-quiz-timer]) > div[data-role=control][data-type=realtime-calculations] {\r\n    margin-right: -{{page.padding.right}};\r\n}\r\n\r\n#form:not([data-has-fixed-header]) div[data-role=page] > div[data-role=page-header][data-has-realtime-calculations][data-has-quiz-timer] > div[data-role=quiz-timer] {\r\n    width: calc( 50% + {{page.padding.left}}  );\r\n    padding-left: calc({{page.padding.left}}  + {{container.padding.horizontal}});\r\n    z-index: 100;\r\n}\r\n\r\n#form:not([data-has-fixed-header]) div[data-role=page] > div[data-role=page-header][data-has-realtime-calculations][data-has-quiz-timer] > div[data-role=control][data-type=\"realtime-calculations\"] {\r\n    width: calc( 100% + 40px );\r\n    margin-left: calc(-50% - 20px );\r\n}\r\n\r\n#form div[data-role=form-errors],\r\n#form[data-submission-phase=show-report] > [data-submission-phase=show-report],\r\n#form[data-submission-phase=show-quiz-results] > [data-submission-phase=show-quiz-results],\r\n#form[data-submission-phase=redirect] > [data-submission-phase=redirect],\r\n#form[data-submission-phase=text-and-redirect] > [data-submission-phase=text-and-redirect],\r\n#form[data-submission-phase=show-text] > [data-submission-phase=show-text],\r\n#form[data-submission-phase=unhandled] > [data-submission-phase=unhandled] {\r\n    width: calc({{grid.pageWidth}}px + {{page.border.width}} + {{page.border.width}});\r\n    padding: {{page.padding.top}} {{page.padding.right}} {{page.padding.bottom}} {{page.padding.left}};\r\n    border-width: {{page.border.width}};\r\n    border-style: {{page.border.style}};\r\n}\r\n\r\n#form {\r\n    padding-top: {{page.margin.top}};\r\n}\r\n\r\n#form[data-has-language-selector] {\r\n    padding-top: calc({{page.margin.top}} + 40px);\r\n}\r\n\r\n#form[data-loader-type=viewer] {\r\n    padding-bottom: {{page.margin.bottom}};\r\n}\r\n\r\n#form[data-layout-type=desktop] div[data-role=page][data-page-index=\"0\"],\r\n#form[data-submission-phase=show-html] > [data-submission-phase=show-html],\r\n#form[data-loader-type=viewer] div[data-role=page][data-is-active] {\r\n    margin: 0 auto 0 auto;\r\n}\r\n\r\n#form div[data-role=page] + [data-role=page-break] {\r\n    width: calc({{grid.pageWidth}}px + {{page.border.width}} + {{page.border.width}});\r\n    height: calc({{page.margin.top}} + {{page.margin.bottom}});\r\n}\r\n\r\n#form div[data-role=page] + [data-role=page-break][data-is-last-page] {\r\n    height: {{page.margin.bottom}};\r\n}\r\n\r\n#form div[data-role=control],\r\n#form div[data-role=container][data-type=div],\r\n#form div[data-role=container][data-type=likert-wrapper] {\r\n    padding: {{container.padding.vertical}} {{container.padding.horizontal}};\r\n    border-width: {{control.border.width}};\r\n    border-style: {{control.border.style}};\r\n    border-radius: {{control.border.radius}};\r\n}\r\n\r\n/** CONTROL:normal **/\r\n#form div[data-role=control]:not(:hover):not(.selected):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]),\r\n#form div[data-role=container][data-type=div]:not(:hover):not(.selected):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]),\r\n#form div[data-role=container][data-type=likert-wrapper]:not(:hover):not(.selected):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) {\r\n    background-color: {{control.normal.background.color}};\r\n    border-color: {{control.normal.border.color}};\r\n}\r\n\r\n/** CONTROL:hover **/\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=editor] div[data-role=control]:hover:not(.selected):not([data-is-selected]):not([data-is-drag-source]):not([data-disabled]):not([data-is-active]):not([data-has-errors]),\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=editor] div[data-role=container][data-type=div]:hover:not([data-is-drag-source]):not(.selected):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]):not([data-num-children]),\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=editor] div[data-role=container][data-type=likert-wrapper]:hover:not([data-is-drag-source]):not(.selected):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) {\r\n    background-color: {{control.hover.background.color}};\r\n    border-color: {{control.hover.border.color}};\r\n}\r\n\r\n/** CONTROL:selected **/\r\n#form[data-loader-type=editor] div[data-role=control][data-is-selected]:not([data-disabled]):not([data-is-active]):not([data-has-errors]),\r\n#form[data-loader-type=editor] div[data-role=control].selected:not([data-disabled]):not([data-is-active]):not([data-has-errors]),\r\n#form[data-loader-type=editor] div[data-role=container][data-type=div][data-is-selected]:not([data-disabled]):not([data-is-active]):not([data-has-errors]),\r\n#form[data-loader-type=editor] div[data-role=container][data-type=div].selected:not([data-disabled]):not([data-is-active]):not([data-has-errors]),\r\n#form[data-loader-type=editor] div[data-role=container][data-type=likert-wrapper][data-is-selected]:not([data-disabled]):not([data-is-active]):not([data-has-errors]),\r\n#form[data-loader-type=editor] div[data-role=container][data-type=likert-wrapper].selected:not([data-disabled]):not([data-is-active]):not([data-has-errors]) {\r\n    background-color: {{control.selected.background.color}};\r\n    border-color: {{control.selected.border.color}};\r\n}\r\n\r\n/** CONTROL:disabled **/\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]),\r\n#form div[data-role=container][data-type=div][data-disabled]:not([data-is-active]):not([data-has-errors]),\r\n#form div[data-role=container][data-type=likert-wrapper][data-disabled]:not([data-is-active]):not([data-has-errors]) {\r\n    background-color: {{control.disabled.background.color}};\r\n    border-color: {{control.disabled.border.color}};\r\n}\r\n\r\n/** CONTROL:active **/\r\n#form[data-loader-type=editor] div[data-role=control][data-is-active]:not([data-has-errors]),\r\n#form[data-loader-type=editor] div[data-role=container][data-type=div][data-is-active]:not([data-has-errors]),\r\n#form[data-loader-type=editor] div[data-role=container][data-type=likert-wrapper][data-is-active]:not([data-has-errors]) {\r\n    background-color: {{control.focused.background.color}};\r\n    border-color: {{control.focused.border.color}};\r\n}\r\n\r\n/** CONTROL:error **/\r\n#form div[data-role=control][data-has-errors],\r\n#form div[data-role=container][data-type=div][data-has-errors],\r\n#form div[data-role=container][data-type=likert-wrapper][data-has-errors] {\r\n    background-color: {{control.error.background.color}};\r\n    border-color: {{control.error.border.color}};\r\n}\r\n\r\n/** CONTROLS FROM HEADER AND FOOTER **/\r\n#form [data-role=page] > [data-role=page-header] [data-role=control],\r\n#form [data-role=page] > [data-role=page-footer] [data-role=control] {\r\n    background-color: {{control.normal.background.color}} !important;\r\n    border-color: {{control.normal.border.color}} !important;\r\n}\r\n\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=editor] [data-role=page] > [data-role=page-header] [data-role=control]:hover,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=editor] [data-role=page] > [data-role=page-footer] [data-role=control]:hover {\r\n    background-color: {{control.hover.background.color}} !important;\r\n    border-color: {{control.hover.border.color}} !important;\r\n}\r\n\r\n#form [data-role=page] > [data-role=page-header] [data-role=control][data-is-selected],\r\n#form [data-role=page] > [data-role=page-footer] [data-role=control][data-is-selected] {\r\n    background-color: {{control.selected.background.color}};\r\n    border-color: {{control.selected.border.color}};\r\n}\r\n\r\n/** LABEL APPEARANCE **/\r\n#form div[data-role=control] label[data-role=label],\r\n#form div[data-role=container][data-type=likert-wrapper] label[data-role=label] {\r\n    font-family: {{form.font.family}};\r\n    font-size: {{form.font.size}};\r\n    font-weight: {{form.font.weight}};\r\n    font-style: {{form.font.style}};\r\n    line-height: {{form.font.line.height}};\r\n    padding-top: {{label.padding.top}};\r\n    padding-bottom: {{label.padding.bottom}};\r\n    margin-top: {{label.margin.top}};\r\n    margin-bottom: {{label.margin.bottom}};\r\n}\r\n\r\n/** LABEL:normal **/\r\n#form,\r\n#form div[data-role=control]:not(:hover):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) label[data-role=label],\r\n#form div[data-role=container][data-type=likert-wrapper]:not(:hover):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) label[data-role=label] {\r\n    color: {{label.normal.color}};\r\n}\r\n\r\n/** LABEL:hover **/\r\n#form div[data-role=control]:hover:not([data-is-selected]):not([data-is-drag-source]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) label[data-role=label],\r\n#form div[data-role=container][data-type=likert-wrapper]:hover:not([data-is-selected]):not([data-is-drag-source]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) label[data-role=label] {\r\n    color: {{label.hover.color}};\r\n}\r\n\r\n/** LABEL:selected **/\r\n#form div[data-role=control][data-is-selected]:not([data-disabled]):not([data-is-active]):not([data-has-errors]) label[data-role=label],\r\n#form div[data-role=container][data-type=likert-wrapper][data-is-selected]:not([data-disabled]):not([data-is-active]):not([data-has-errors]) label[data-role=label] {\r\n    color: {{label.selected.color}};\r\n}\r\n\r\n/** LABEL:disabled **/\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) label[data-role=label],\r\n#form div[data-role=container][data-type=likert-wrapper][data-disabled]:not([data-is-active]):not([data-has-errors]) label[data-role=label] {\r\n    color: {{label.disabled.color}};\r\n}\r\n\r\n/** LABEL:active **/\r\n#form div[data-role=control][data-is-active]:not([data-has-errors]) label[data-role=label],\r\n#form div[data-role=container][data-type=likert-wrapper][data-is-active]:not([data-has-errors]) label[data-role=label] {\r\n    color: {{label.focused.color}};\r\n}\r\n\r\n/** LABEL:error **/\r\n#form div[data-role=control][data-has-errors] label[data-role=label],\r\n#form div[data-role=container][data-type=likert-wrapper][data-has-errors] label[data-role=label] {\r\n    color: {{label.error.color}};\r\n}\r\n\r\n#form div[data-role=control][data-is-required]:not([data-type=likert-scale]) label[data-role=label]:after,\r\n#form div[data-role=container][data-is-required][data-type=likert-wrapper] label[data-role=label]:after {\r\n    color: {{error.normal.color}};\r\n}\r\n\r\n/** ERROR appearance **/\r\n#form div[data-role=control] label[data-role=error],\r\n#form div[data-role=container][data-type=likert-wrapper] label[data-role=error] {\r\n    font-family: {{error.font.family}};\r\n    font-size: {{error.font.size}};\r\n    font-weight: {{error.font.weight}};\r\n    font-style: {{error.font.style}};\r\n    line-height: {{error.font.line.height}};\r\n    padding-top: {{error.padding.top}};\r\n    padding-bottom: {{error.padding.bottom}};\r\n    color: {{error.normal.color}};\r\n    white-space: normal;\r\n}\r\n\r\n/** INSTRUCTIONS appearance **/\r\n#form div[data-role=control] dt[data-role=instructions],\r\n#form div[data-role=container][data-type=likert-wrapper] dt[data-role=instructions] {\r\n    font-family: {{instructions.font.family}};\r\n    font-size: {{instructions.font.size}};\r\n    font-weight: {{instructions.font.weight}};\r\n    font-style: {{instructions.font.style}};\r\n    line-height: {{instructions.font.line.height}};\r\n    padding-top: {{instructions.padding.top}};\r\n    padding-bottom: {{instructions.padding.bottom}};\r\n    margin-top: {{instructions.margin.top}};\r\n    margin-bottom: {{instructions.margin.bottom}};\r\n}\r\n\r\n/** INSTRUCTIONS:normal **/\r\n#form div[data-role=control]:not(:hover):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) dt[data-role=instructions],\r\n#form div[data-role=container][data-type=likert-wrapper]:not(:hover):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) dt[data-role=instructions] {\r\n    color: {{instructions.normal.color}};\r\n}\r\n\r\n/** INSTRUCTIONS:hover **/\r\n#form div[data-role=control]:hover:not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) dt[data-role=instructions],\r\n#form div[data-role=container][data-type-likert-wrapper]:hover:not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) dt[data-role=instructions] {\r\n    color: {{instructions.hover.color}};\r\n}\r\n\r\n/** INSTRUCTIONS:selected **/\r\n#form div[data-role=control][data-is-selected]:not([data-disabled]):not([data-is-active]):not([data-has-errors]) dt[data-role=instructions],\r\n#form div[data-role=container][data-type=likert-wrapper][data-is-selected]:not([data-disabled]):not([data-is-active]):not([data-has-errors]) dt[data-role=instructions] {\r\n    color: {{instructions.selected.color}};\r\n}\r\n\r\n/** INSTRUCTIONS:disabled **/\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) dt[data-role=instructions],\r\n#form div[data-role=container][data-type=likert-wrapper][data-disabled]:not([data-is-active]):not([data-has-errors]) dt[data-role=instructions] {\r\n    color: {{instructions.disabled.color}};\r\n}\r\n\r\n/** INSTRUCTIONS:active **/\r\n#form div[data-role=control][data-is-active]:not([data-has-errors]) dt[data-role=instructions],\r\n#form div[data-role=container][data-type=likert-wrapper][data-is-active]:not([data-has-errors]) dt[data-role=instructions] {\r\n    color: {{instructions.focused.color}};\r\n}\r\n\r\n/** INSTRUCTIONS:error **/\r\n#form div[data-role=control][data-has-errors] dt[data-role=instructions],\r\n#form div[data-role=container][data-type=likert-wrapper][data-has-errors] dt[data-role=instructions] {\r\n    color: {{instructions.error.color}};\r\n}\r\n\r\n/** INPUT appearance **/\r\n#form div[data-role=control] input[data-role=i123-input]:not([type=radio]):not([type=checkbox]):not([type=reset]):not([type=hidden]):not([data-no-theme]),\r\n#form div[data-role=control] select[data-role=i123-input],\r\n#form div[data-role=control] textarea[data-role=i123-input],\r\n#form div[data-role=control] div[data-role=i123-input]:not([data-type=file]),\r\n#form div[data-role=control] div[data-role=i123-input][data-type=file] > div[data-role=upload-overlay],\r\n#form div[data-role=control] div[data-role=i123-input][data-type=file] > div[data-role=abort-all-uploads],\r\n#form div[data-role=control][data-type=check-box] input[data-role=other],\r\n#form div[data-role=control][data-type=radio] input[data-role=other],\r\n#form div[data-role=control] div[data-role=price-container] {\r\n    color: {{input.normal.color}};\r\n    padding: {{input.padding.vertical}} {{input.padding.horizontal}};\r\n    border-width: {{input.border.width}} !important;\r\n    border-style: {{input.border.style}} !important;\r\n    border-radius: {{input.border.radius}} !important;\r\n    font-family: {{input.font.family}};\r\n    font-size: {{input.font.size}};\r\n    font-weight: {{input.font.weight}};\r\n    font-style: {{input.font.style}};\r\n    line-height: {{input.font.line.height}};\r\n}\r\n\r\n/** STAR RATING appearance **/\r\n#form div[data-role=control] div[data-type=star-rating][data-role=i123-input] {\r\n    color: {{input.disabled.color}};\r\n}\r\n\r\n#form div[data-role=control] div[data-role=i123-input][data-type=date] > div[data-role=expander]:after,\r\n#form div[data-role=control] div[data-role=i123-input][data-type=time] > div[data-role=expander]:after {\r\n    right: calc({{input.padding.horizontal}} - 3px);\r\n}\r\n\r\n\r\n#form div[data-role=control] input[data-role=i123-input]:not([type=radio]):not([type=checkbox]):not([type=reset]):not([type=hidden]):not([data-no-theme]),\r\n#form div[data-role=control] select[data-role=i123-input],\r\n#form div[data-role=control] div[data-role=i123-input],\r\n#form div[data-role=control][data-type=form-captcha] img[data-role=i123-captcha]:not([data-captcha-type=recaptcha]),\r\n#form div[data-role=control][data-type=check-box] input[data-role=other],\r\n#form div[data-role=control][data-type=radio] input[data-role=other],\r\n#form div[data-role=control] div[data-role=price-container] {\r\n    height: calc( {{input.padding.vertical}} + {{input.padding.vertical}} + {{input.border.width}} + {{input.border.width}} + {{input.font.line.height}} );\r\n}\r\n\r\n/** RADIO appearance **/\r\n#form div[data-role=control] input[data-role=i123-input][type=radio] + label {\r\n    border-width: {{input.border.width}};\r\n    border-style: {{input.border.style}};\r\n    {{#unless radio.appearance}}border-radius: calc({{radio.width}} / 2);{{#else}}border-radius: {{input.border.radius}};{{#end}}\r\n    width: {{radio.width}};\r\n    height: {{radio.height}};\r\n    margin: 0 {{radio.margin}} 0 0;\r\n    background-color: {{input.normal.background.color}};\r\n    border-color: {{input.normal.border.color}};\r\n}\r\n\r\n{{#if radio.appearance}}\r\n#form input[data-role=i123-input][type=radio]:checked + label:after {\r\n    content: \"\\e990\";\r\n    font-weight: bold;\r\n}\r\n{{#end}}\r\n\r\n#form div[data-role=control] input[data-role=i123-input][type=radio]:checked + label:after {\r\n    font-size: {{radio.width}};\r\n}\r\n\r\n#form div[data-role=control] input[data-role=i123-input][type=checkbox]:checked + label:after {\r\n    font-size: {{checkbox.width}};\r\n}\r\n\r\n /**\r\n * RADIO and LIKERT SCALE: checked & CONTROL : active and not active\r\n */\r\n #form div[data-role=control][data-type=radio] input[data-role=i123-input][type=radio]:checked + label,\r\n #form div[data-role=control][data-type=likert-scale] input[data-role=i123-input][type=radio]:checked + label {\r\n    border-color: {{input.normal.color}} !important;\r\n    background-color: {{input.normal.color}} !important;\r\n }\r\n\r\n #form div[data-role=control][data-type=radio] input[data-role=i123-input][type=radio]:checked + label:after,\r\n #form div[data-role=control][data-type=likert-scale] input[data-role=i123-input][type=radio]:checked + label:after {\r\n    color: {{form.background.color}};\r\n }\r\n\r\n #form div[data-role=control][data-type=radio] input[data-role=i123-input][type=radio]:checked:hover + label,\r\n #form div[data-role=control][data-type=likert-scale] input[data-role=i123-input][type=radio]:checked:hover + label {\r\n    border-color: {{input.hover.border.color}} !important;\r\n }\r\n\r\n/**\r\n * CHECKBOX appearance\r\n **/\r\n#form div[data-role=control] input[data-role=i123-input][type=checkbox] + label {\r\n    border-width: {{input.border.width}};\r\n    border-style: {{input.border.style}};\r\n    width: {{checkbox.width}};\r\n    height: {{checkbox.height}};\r\n    border-radius: {{input.border.radius}};\r\n    margin: 0 {{checkbox.margin}} 0 0;\r\n\r\n    background-color: {{input.normal.background.color}};\r\n    border-color: {{input.normal.border.color}};\r\n\r\n}\r\n\r\n /**\r\n  * CHECKBOX and TOS: checked & CONTROL : active and not active states\r\n  */\r\n\r\n  #form div[data-role=control][data-type=check-box] input[data-role=i123-input][type=checkbox]:checked + label,\r\n  #form div[data-role=control][data-type=terms-of-service] input[data-role=i123-input][type=checkbox]:checked + label {\r\n      border-color: {{input.normal.color}} !important;\r\n      border-radius: {{input.border.radius}};\r\n      border-width: {{input.border.width}};\r\n      border-style: {{input.border.style}};\r\n      background-color: {{input.normal.color}} !important;\r\n  }\r\n\r\n  #form div[data-role=control][data-type=check-box] input[data-role=i123-input][type=checkbox]:checked:hover + label,\r\n  #form div[data-role=control][data-type=terms-of-service] input[data-role=i123-input][type=checkbox]:checked:hover + label {\r\n      border-color: {{input.hover.border.color}} !important;\r\n  }\r\n\r\n  #form div[data-role=control][data-type=check-box] input[data-role=i123-input][type=checkbox]:checked + label:after,\r\n  #form div[data-role=control][data-type=terms-of-service] input[data-role=i123-input][type=checkbox]:checked + label:after {\r\n      color: {{page.background.color}};\r\n  }\r\n\r\n/**\r\n * CHECKBOX INFO - no. of choices left\r\n */\r\n#form [data-role=control][data-show-number-of-choices] [data-role=input-row] > [data-role=choice] > label[data-role=choice] > span[data-role=label-info] {\r\n    color: {{ label.disabled.color}};\r\n}\r\n\r\n\r\n/**CHECKBOX & RADIO */\r\n\r\n#form div[data-role=control][data-type=check-box] label[data-role=choice],\r\n#form [data-role=control] [data-role=input-row] label[data-role=tos-label] {\r\n    padding-left: calc( {{checkbox.width}} + {{checkbox.margin}} );\r\n    padding-top: {{input.border.width}};\r\n}\r\n\r\n#form div[data-role=control][data-type=radio] label[data-role=choice]{\r\n    padding-left: calc( {{radio.width}} + {{radio.margin}} );\r\n    padding-top: {{input.border.width}};\r\n}\r\n\r\n#form[data-text-direction=rtl] div[data-role=control][data-type=check-box] label[data-role=choice],\r\n#form[data-text-direction=rtl] [data-role=control] [data-role=input-row] label[data-role=tos-label] {\r\n    padding-right: calc( {{checkbox.width}} + {{checkbox.margin}} + {{container.padding.horizontal}} - {{control.border.width}} - 1px );\r\n}\r\n\r\n#form[data-text-direction=rtl] div[data-role=control][data-type=radio] label[data-role=choice] {\r\n    padding-right: calc( {{radio.width}} + {{radio.margin}} + {{container.padding.horizontal}} - {{control.border.width}} - 1px );\r\n}\r\n\r\n#form div[data-role=control][data-type=check-box] label[data-role=choice] > input[data-role=i123-input][type=checkbox]+ label,\r\n#form [data-role=control] [data-role=input-row] label[data-role=tos-label] > input[data-role=i123-input][type=checkbox] + label {\r\n    margin-left: calc( -{{checkbox.width}} - {{checkbox.margin}} );\r\n    margin-right: {{checkbox.margin}};\r\n}\r\n\r\n#form div[data-role=control][data-type=radio] label[data-role=choice] > input[data-role=i123-input][type=radio]+ label {\r\n    margin-left: calc( -{{radio.width}} - {{radio.margin}} );\r\n    margin-right: {{radio.margin}};\r\n}\r\n\r\n#form[data-text-direction=rtl] div[data-role=control][data-type=check-box] label[data-role=choice] > input[data-role=i123-input][type=checkbox]+ label,\r\n#form[data-text-direction=rtl] [data-role=control] [data-role=input-row] label[data-role=tos-label] > input[data-role=i123-input][type=checkbox] + label {\r\n    margin-right: calc( -{{checkbox.width}} - {{checkbox.margin}} );\r\n    margin-left: {{checkbox.margin}};\r\n}\r\n\r\n#form[data-text-direction=rtl] div[data-role=control][data-type=radio] label[data-role=choice] > input[data-role=i123-input][type=radio]+ label {\r\n    margin-right: calc( -{{radio.width}} - {{radio.margin}} );\r\n    margin-left: {{radio.margin}};\r\n}\r\n\r\n/**\r\n * disabled choice\r\n */\r\n\r\n#form div[data-role=control][data-type=check-box] label[data-role=choice][data-disabled],\r\n#form div[data-role=control][data-type=radio] label[data-role=choice][data-disabled] {\r\n    color: {{label.disabled.color}};\r\n}\r\n\r\n#form div[data-role=control][data-type=check-box] label[data-role=choice][data-disabled] > input[data-role=i123-input][type=checkbox]+ label,\r\n#form div[data-role=control][data-type=radio] label[data-role=choice][data-disabled] > input[data-role=i123-input][type=radio]+ label{\r\n    background-color: {{input.disabled.background.color}};\r\n    border-color: {{input.disabled.border.color}};\r\n}\r\n\r\n#form div[data-role=control]:not(:hover):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) input[data-role=i123-input][type=checkbox][data-disabled] + label,\r\n#form div[data-role=control]:not(:hover):not([data-is-selected]):not([data-disabled]):not([data-is-active]):not([data-has-errors]) input[data-role=i123-input][type=radio][data-disabled]+ label {\r\n    background-color: {{input.disabled.background.color}};\r\n    border-color: {{input.disabled.border.color}};\r\n}\r\n\r\n/** INPUT: normal **/\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) input[data-role=i123-input]:not([data-no-theme]):not([type=reset]):not([type=radio]):not([type=checkbox]):not([type=hidden]),\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) select[data-role=i123-input],\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) div[data-role=i123-input],\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) div[data-role=price-container],\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) div[data-role=i123-input][type=file] > [data-role=upload-overlay],\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) div[data-role=i123-input][type=file] > [data-role=abort-all-uploads],\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) textarea[data-role=i123-input],\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) input[data-role=i123-input][type=radio] + label,\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) input[data-role=i123-input][type=checkbox] + label,\r\n#form div[data-role=control]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) div[data-role=choice] input[data-role=other],\r\n#form div[data-role=control][data-type=signature]:not([data-is-selected]):not([data-disabled]):not([data-has-errors]) [data-role=signature-container] {\r\n    background-color: {{input.normal.background.color}};\r\n    border-color: {{input.normal.border.color}};\r\n}\r\n\r\n#form div[data-ui-role=ui-element][data-type=file] > div[data-role=upload-overlay] > div[data-role=placeholder],\r\n#form div[data-ui-role=ui-element][data-type=file] > div[data-role=abort-all-uploads] {\r\n    color: {{input.disabled.color}};\r\n}\r\n\r\n/** INPUT:hover **/\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) input[data-role=i123-input]:not([type=reset]):not([type=radio]):not([type=checkbox]):not([type=hidden]):not([data-disabled]):not([data-no-theme]):hover,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) select[data-role=i123-input]:not([data-disabled]):hover,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) div[data-role=i123-input]:not([data-type=file]):not([data-disabled]):hover,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) div[data-role=price-container]:not([data-disabled]):hover,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) div[data-role=i123-input][data-type=file]:not([data-disabled]) > [data-role=upload-overlay]:hover,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) div[data-role=i123-input][data-type=file]:not([data-disabled]) > [data-role=abort-all-uploads]:hover,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) textarea[data-role=i123-input]:not([data-disabled]):hover,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) input[data-role=i123-input][type=radio]:not([data-disabled]):hover + label,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) input[data-role=i123-input][type=checkbox]:not([data-disabled]):hover + label,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) div[data-role=choice] input[data-role=other]:not([data-disabled]):hover,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) div[data-role=choice] label[data-role=choice] > input + label:focus,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) div[data-role=input-row] label[data-role=tos-label] > input + label:focus,\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control][data-type=signature]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]) [data-role=signature-container]:hover {\r\n    background-color: {{input.hover.background.color}};\r\n    border-color: {{input.hover.border.color}};\r\n}\r\n\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]):not([data-is-active]) div[data-role=i123-input][data-type=file]:not([data-disabled]) > [data-role=upload-overlay]:hover > div[data-role=placeholder],\r\nbody:not([data-mouse-gesture-type]) #form[data-loader-type=viewer] div[data-role=control]:not([data-is-drag-source]):not([data-disabled]):not([data-has-errors]):not([data-is-active]) div[data-role=i123-input][data-type=file]:not([data-disabled]) > [data-role=abort-all-uploads]:hover {\r\n    color: {{colors.selected.color}};\r\n}\r\n\r\n/**INPUT:disabled **/\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) input[data-role=i123-input]:not([data-no-theme]):not([type=reset]):not([type=radio]):not([type=checkbox]):not([type=hidden]),\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) select[data-role=i123-input],\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) div[data-role=i123-input],\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) div[data-role=price-container],\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) textarea[data-role=i123-input],\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) input[data-role=i123-input][type=radio] + label,\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) input[data-role=i123-input][type=checkbox] + label,\r\n#form div[data-role=control][data-disabled]:not([data-is-active]):not([data-has-errors]) div[data-role=choice] input[data-role=other]{\r\n    background-color: {{input.disabled.background.color}};\r\n    border-color: {{input.disabled.border.color}};\r\n}\r\n\r\n/**EDITOR > INPUT:active **/\r\n#form[data-loader-type=editor] div[data-role=control][data-is-active]:not([data-has-errors]) input[data-role=i123-input]:not([data-no-theme]):not([type=reset]):not([type=radio]):not([type=checkbox]):not([type=hidden]),\r\n#form[data-loader-type=editor] div[data-role=control][data-is-active]:not([data-has-errors]) select[data-role=i123-input],\r\n#form[data-loader-type=editor] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input]:not([data-type=file]),\r\n#form[data-loader-type=editor] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=price-container],\r\n#form[data-loader-type=editor] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-type=file] > div[data-role=upload-overlay],\r\n#form[data-loader-type=editor] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-type=file] > div[data-role=abort-all-uploads],\r\n#form[data-loader-type=editor] div[data-role=control][data-is-active]:not([data-has-errors]) textarea[data-role=i123-input],\r\n#form[data-loader-type=editor] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=choice] input[data-role=other] {\r\n    background-color: {{input.normal.background.color}};\r\n    border-color: {{input.normal.border.color}};\r\n}\r\n\r\n/**VIEWER > INPUT:active **/\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) input[data-role=i123-input]:not([data-no-theme]):not([type=reset]):not([type=radio]):not([type=checkbox]):not([type=hidden]):focus,\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) select[data-role=i123-input]:focus,\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input]:not([data-type=file]):not([data-type=dropdown]):focus,\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-is-focused-child-element],\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=price-container][data-is-focused-child-element],\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-type=file]:focus > [data-role=upload-overlay],\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-type=file]:focus > [data-role=abort-all-uploads],\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-type=file][data-file-tab-focus-state] div[data-role=upload-overlay],\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) textarea[data-role=i123-input]:focus,\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=choice] input[data-role=other]:focus {\r\n    background-color: {{input.focused.background.color}} !important;\r\n    border-color: {{input.focused.border.color}} !important;\r\n}\r\n\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-type=file][data-file-tab-focus-state] div[data-role=upload-overlay] div[data-role=placeholder] {\r\n    color: {{input.focused.border.color}};\r\n}\r\n\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-type=file]:focus > [data-role=upload-overlay] > [data-role=placeholder],\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-type=file]:hover > [data-role=upload-overlay] > [data-role=placeholder],\r\n#form[data-loader-type=viewer] div[data-role=control][data-is-active]:not([data-has-errors]) div[data-role=i123-input][data-type=file] > [data-role=abort-all-uploads] {\r\n    color: {{colors.selected.color}};\r\n}\r\n\r\n/**INPUT:error **/\r\n#form div[data-role=control][data-has-errors] input[data-role=i123-input]:not([data-no-theme]):not([type=reset]):not([type=radio]):not([type=checkbox]):not([type=hidden]),\r\n#form div[data-role=control][data-has-errors] select[data-role=i123-input],\r\n#form div[data-role=control][data-has-errors] div[data-role=i123-input]:not([data-type=file]),\r\n#form div[data-role=control][data-has-errors] div[data-role=price-container],\r\n#form div[data-role=control][data-has-errors] div[data-role=i123-input][data-type=file] [data-role=upload-overlay],\r\n#form div[data-role=control][data-has-errors] textarea[data-role=i123-input],\r\n#form div[data-role=control][data-has-errors] input[data-role=i123-input][type=radio] + label,\r\n#form div[data-role=control][data-has-errors] input[data-role=i123-input][type=checkbox] + label,\r\n#form div[data-role=control][data-has-errors] div[data-role=choice] input[data-role=other],\r\n#form div[data-role=control][data-has-errors] div[data-role=price-container] span[data-role=currency-code] {\r\n    background-color: {{input.error.background.color}};\r\n    border-color: {{input.error.border.color}};\r\n    color: {{input.error.color}};\r\n}\r\n\r\n#form div[data-role=control][data-has-errors] div[data-role=price-container] input {\r\n    color: {{input.error.color}};\r\n}\r\n#form div[data-role=control][data-has-errors] div[data-role=i123-input][data-type=file] [data-role=upload-overlay] > [data-role=placeholder] {\r\n    color: {{error.normal.color}};\r\n}\r\n\r\n#form div[data-role=control][data-has-errors] div[data-type=date][data-role=i123-input] div[data-role=date-part],\r\n#form div[data-role=control][data-has-errors] div[data-type=time][data-role=i123-input] div[data-role=date-part] {\r\n    color: {{input.error.border.color}};\r\n}\r\n\r\n/**\r\n * INPUT ROWS\r\n */\r\n#form [data-role=control]:not([data-type=check-box]):not([data-type=radio]) [data-role=input-row]:not([data-is-first-row]) {\r\n    margin-top: {{input.margin.vertical}};\r\n}\r\n\r\n#form [data-role=control]:not([data-type=check-box]):not([data-type=radio]) [data-role=input-row]:not([data-is-last-row]) {\r\n    margin-bottom: {{input.margin.vertical}};\r\n}\r\n\r\n#form [data-role=control]:not([data-type=check-box]):not([data-type=radio])[data-force-mobile-rendering] [data-role=input-row] > * + * {\r\n    margin-top: {{input.margin.vertical}} !important;\r\n}\r\n\r\n#form [data-role=control][data-type=check-box] [data-role=input-row] label[data-role=choice],\r\n#form [data-role=control][data-type=radio] [data-role=input-row] label[data-role=choice] {\r\n    padding-top: calc({{input.padding.vertical}} + {{input.border.width}});\r\n    padding-bottom: calc({{input.padding.vertical}} + {{input.border.width}});\r\n    line-height: {{input.font.line.height}};\r\n}\r\n\r\n/**\r\n * BUTTONS\r\n */\r\n#form button[data-role] {\r\n    font-family: {{button.font.family}};\r\n    font-size: {{button.font.size}};\r\n    font-weight: {{button.font.weight}};\r\n    font-style: {{button.font.style}};\r\n    line-height: {{button.font.line.height}};\r\n    padding: 0 {{button.padding.horizontal}};\r\n    margin: 0 calc({{grid.columnSpacing}}px / 2) 0 calc({{grid.columnSpacing}}px / 2);\r\n    border-width: {{button.border.width}};\r\n    border-style: {{button.border.style}};\r\n    border-radius: {{button.border.radius}};\r\n    height: calc( {{button.padding.vertical}} + {{button.font.line.height}} + {{button.padding.vertical}} );\r\n    margin-top: {{container.padding.vertical}};\r\n}\r\n\r\n#form button[data-role] {\r\n    background-color: {{button.secondary.normal.background.color}};\r\n    border-color: {{button.secondary.normal.border.color}};\r\n    color: {{button.secondary.normal.color}};\r\n}\r\n\r\nbody:not([data-mouse-gesture-type]) #form button[data-role]:not([disabled]):hover {\r\n    background-color: {{button.secondary.hover.background.color}};\r\n    border-color: {{button.secondary.hover.border.color}};\r\n    color: {{button.secondary.hover.color}};\r\n}\r\n\r\n#form button[data-role][disabled] {\r\n    background-color: {{button.secondary.disabled.background.color}};\r\n    border-color: {{button.secondary.disabled.border.color}};\r\n    color: {{button.secondary.disabled.color}};\r\n}\r\n\r\n#form button[data-role=submit],\r\n#form button[data-role=update] {\r\n    background-color: {{button.primary.normal.background.color}};\r\n    border-color: {{button.primary.normal.border.color}};\r\n    color: {{button.primary.normal.color}};\r\n}\r\n\r\nbody:not([data-mouse-gesture-type]) #form button[data-role=submit]:not([disabled]):hover,\r\nbody:not([data-mouse-gesture-type]) #form button[data-role=update]:not([disabled]):hover {\r\n    background-color: {{button.primary.hover.background.color}};\r\n    border-color: {{button.primary.hover.border.color}};\r\n    color: {{button.primary.hover.color}};\r\n}\r\n\r\n#form button[data-role=submit][disabled],\r\n#form button[data-role=update][disabled] {\r\n    background-color: {{button.primary.disabled.background.color}};\r\n    border-color: {{button.primary.disabled.border.color}};\r\n    color: {{button.primary.disabled.color}};\r\n}\r\n\r\n/**\r\n * FORM TYPOGRAPHY\r\n */\r\n#form div[data-role=control] h1 {\r\n    font-size: 2em;\r\n}\r\n\r\n#form div[data-role=control] h2 {\r\n    font-size: 1.8em;\r\n}\r\n\r\n#form div[data-role=control] h3 {\r\n    font-size: 1.5em;\r\n}\r\n\r\n#form div[data-role=control] h4 {\r\n    font-size: 1.2em;\r\n}\r\n\r\n#form div[data-role=control] h5 {\r\n    font-size: 1em;\r\n}\r\n\r\n#form div[data-role=control] h6 {\r\n    font-size: 0.8em;\r\n}\r\n\r\n#form div[data-role=control] p {\r\n    font-size: 1em;\r\n}\r\n\r\n#form div[data-role=control] h1,\r\n#form div[data-role=control] h2,\r\n#form div[data-role=control] h3,\r\n#form div[data-role=control] h4,\r\n#form div[data-role=control] h5,\r\n#form div[data-role=control] h6,\r\n#form div[data-role=control] p,\r\n#form div[data-role=control][data-type=html-block] span  {\r\n    color: {{form.color}};\r\n}\r\n\r\n/**\r\n * Control renderers\r\n */\r\n#form div[data-renderer-type=tln] > div[data-role=input-row] {\r\n    margin-right: calc(-2 * {{control.border.width}});\r\n}\r\n\r\n#form div[data-role=control][data-renderer-type=tln] label[data-role=label] + dt[data-role=instructions],\r\n#form [data-role=control][data-renderer-type=tlc] dt[data-role=instructions],\r\n#form [data-role=control][data-renderer-type=llc] dt[data-role=instructions],\r\n#form [data-role=control][data-renderer-type=rlc] dt[data-role=instructions] {\r\n    padding-bottom: {{label.padding.bottom}} !important;\r\n}\r\n\r\n#form div[data-role=control][data-renderer-type=tln] label[data-role=label] + dt[data-role=instructions] + div[data-role=input-row],\r\n#form div[data-role=control][data-type=form-captcha][data-renderer-type=tln] label[data-role=label] ~ div[data-role=input-row],\r\n#form[data-layout-type=mobile] div[data-type=payments-selector] div[data-ui-role=ui-element] {\r\n    margin-top: {{label.padding.bottom}} !important;\r\n}\r\n\r\n#form div[data-role=control][data-type=payments-selector][data-renderer-type=tln] label[data-role=label] {\r\n    padding-bottom: {{label.padding.bottom}} !important;\r\n}\r\n\r\n#form div[data-type=payments-selector] > div[data-role=nowrap] > label {\r\n    margin-bottom: {{label.padding.bottom}};\r\n}\r\n\r\n/**\r\n * UI-software elements skinning\r\n */\r\ndiv[data-ui-role=ui-element][data-type=file] > div[data-role=upload] {\r\n    color: {{input.normal.color}};\r\n    background-color: {{input.normal.background.color}};\r\n}\r\n\r\n/**\r\n * Map control\r\n */\r\n#form div[data-role=control][data-type=map] > div[data-role=map-canvas] {\r\n    left: {{container.padding.horizontal}};\r\n    right: {{container.padding.horizontal}};\r\n    top: {{container.padding.vertical}};\r\n    bottom: {{container.padding.vertical}};\r\n}\r\n\r\n/**\r\n * Likert control\r\n */\r\n\r\n#form div[data-role=control][data-type=likert-scale] div[data-role=label-resizer] {\r\n    transform: translateX( calc( -{{grid.columnSpacing}}px / 2 - 2 * {{control.border.width}} ) );\r\n}\r\n\r\n/**\r\n * Star rating control\r\n */\r\n#form div[data-ui-role=ui-element][data-type=star-rating] div[data-role=star][data-rating-tab-focus-state],\r\n#form div[data-ui-role=ui-element][data-type=star-rating] div[data-role=star][data-rating-tab-focus-state][data-is-checked],\r\n#form div[data-ui-role=ui-element][data-type=star-rating] div[data-role=star][data-is-hover] {\r\n    color: {{colors.selected.color}};\r\n}\r\n\r\n#form div[data-ui-role=ui-element][data-type=star-rating] div[data-role=star][data-is-checked]:not([data-is-hover]) {\r\n    color: {{input.normal.color}};\r\n}\r\n\r\n/**\r\n * PAGINATION\r\n */\r\n#form div[data-role=page] > [data-role=page-header] > [data-role=pagination] {\r\n    margin: -{{grid.paddingTop}}px -{{grid.paddingRight}}px 0 -{{grid.paddingLeft}}px;\r\n}\r\n\r\n#form div[data-role=page] > [data-role=page-header] > [data-role=pagination][data-type=steps]:after {\r\n    border-top: 2px solid {{input.disabled.color}};\r\n}\r\n\r\n#form div[data-role=page] > [data-role=page-header] > div[data-role=pagination][data-type=steps] {\r\n    padding: 0 {{grid.paddingRight}}px 0 {{grid.paddingLeft}}px;\r\n}\r\n\r\n#form > div[data-role=page] > div[data-role=page-header] > div[data-role=pagination] > div[data-role=legend] {\r\n    margin: 0 calc({{grid.paddingRight}}px + {{container.padding.horizontal}}) 0 calc({{grid.paddingLeft}}px + {{container.padding.horizontal}});\r\n}\r\n\r\n#form > div[data-role=page] > div[data-role=page-header] > div[data-role=pagination] div[data-role=step]:not([data-is-current]) {\r\n    color: {{input.disabled.color}};\r\n}\r\n\r\n{{#unless page.shadow.visibility}}\r\n    #form div[data-role=page],\r\n    #form div[data-role=control][data-type=realtime-calculations] {\r\n        box-shadow: none;\r\n    }\r\n{{#end}}\r\n\r\n#form [data-role=page] [data-role=page-footer] [data-role=control][data-type=form-action-bar] {\r\n    line-height: calc( {{button.padding.vertical}} + {{button.padding.vertical}} + {{button.font.line.height}} + {{button.border.width}} + {{button.border.width}} + {{grid.columnSpacing}}px + {{button.padding.vertical}} );\r\n}\r\n\r\n#form [data-role=control][data-type=form-action-bar] {\r\n    padding-left: calc({{container.padding.horizontal}} - {{grid.columnSpacing}}px / 2);\r\n    padding-right: calc({{container.padding.horizontal}} - {{grid.columnSpacing}}px / 2);\r\n}\r\n\r\n#form [data-role=control]:not([data-force-mobile-rendering]) [data-role=input-row][data-fill-colspan=\"0\"] {\r\n    margin-right: calc(-2 * {{control.border.width}});\r\n}\r\n\r\n{{#if other.forcePagebreaks}}\r\n#form[data-loader-type=editor] > [data-role=page] + [data-role=page-break] > [data-role=merge-pages] {\r\n    display: block !important;\r\n    top: 50% !important;\r\n    transform: translateY( -50% );\r\n}\r\n{{#end}}\r\n\r\ndiv[data-ui-role=ui-element][data-type=file] > div[data-role=files-container] > [data-role=upload] > [data-role=size] {\r\n    color: {{input.disabled.color}};\r\n}\r\n\r\ndiv[data-ui-role=ui-element][data-type=file] > div[data-role=files-container] > [data-role=upload][data-has-error] {\r\n    background-color: {{input.error.background.color}};\r\n}\r\n\r\n#form div[data-role=control] div[data-role=i123-input][data-type=file] [data-role=button-remove] {\r\n    color: {{input.disabled.color}};\r\n}\r\n\r\n#form div[data-role=control] div[data-role=i123-input][data-type=file] [data-role=button-remove]:hover {\r\n    color: {{input.normal.color}};\r\n}\r\n\r\n/**\r\n * Signature Control\r\n */\r\n\r\n#form div[data-role=control][data-type=signature] div[data-role=signature-container] > a[data-role=clear-signature] {\r\n    color: {{input.normal.border.color}};\r\n}\r\n\r\n#form div[data-role=control][data-type=signature] div[data-role=signature-container]:hover > a[data-role=clear-signature] {\r\n    color: {{input.hover.border.color}};\r\n}\r\n\r\n#form div[data-role=control][data-type=terms-of-service] [data-role=input-row],\r\n#form div[data-role=control][data-type=likert-scale] [data-role=input-column] {\r\n    padding-top: {{input.padding.vertical}};\r\n}\r\n\r\n#form div[data-role=control][data-type=terms-of-service] a {\r\n    color: {{colors.selected.color}};\r\n}\r\n\r\n#form [data-role=container][data-type=likert-wrapper] [data-role=likert-header] div[data-role=scale-column] {\r\n    color: {{input.disabled.color}};\r\n}\r\n\r\n#form div[data-role=control][data-type=price] div[data-role=price-container] span {\r\n    padding-left: {{input.padding.horizontal}};\r\n    padding-top: {{input.border.width}};\r\n}\r\n\r\n#form[data-text-direction=rtl] div[data-role=control][data-type=price] div[data-role=price-container] span {\r\n    padding-right: {{input.padding.horizontal}};\r\n}\r\n\r\n#form div[data-role=control][data-type=price] div[data-role=price-container] input {\r\n    padding-left: calc( {{input.font.size}} * 2.6 + {{input.padding.horizontal}} );\r\n    top: 50%;\r\n}\r\n\r\n#form[data-text-direction=rtl] div[data-role=control][data-type=price] div[data-role=price-container] input {\r\n    padding-right: calc( {{input.font.size}} * 2.6 + {{input.padding.horizontal}} );\r\n}\r\n\r\n#form div[data-role=page-header] > div[data-role=control][data-type=language-selector] {\r\n    top: -{{page.margin.top}};\r\n}\r\n\r\n#form div[data-type=payments-selector] img,\r\n#form div[data-type=payments-selector] img + span:after {\r\n    border-radius: {{input.border.radius}};\r\n    background-color: {{colors.selected.color}};\r\n    border: 1px solid {{colors.selected.color}};\r\n}\r\n\r\n#form[data-has-fixed-header] div[data-role=page] > div[data-role=page-header][data-has-realtime-calculations][data-has-quiz-timer] > [data-role=quiz-timer] {\r\n    padding-left: {{page.padding.left}};\r\n}",
    "model": {
        "colors": {
            "selected": {
                "color": "#0099cc"
            }
        },
        "form": {
            "background": {
                "color": "#f5f5f5",
                "image": "",
                "position": "center",
                "repeat": "no-repeat",
                "size": "cover",
                "attachment": "scroll"
            },
            "font": {
                "family": "'Open Sans', sans-serif",
                "size": "14px",
                "weight": "normal",
                "style": "normal",
                "line": {
                    "height": "1.2em"
                }
            },
            "color": "#4c4c4c"
        },
        "page": {
            "background": {
                "color": "#ffffff",
                "image": "",
                "position": "center",
                "repeat": "no-repeat",
                "size": "cover",
                "attachment": "scroll"
            },
            "border": {
                "width": "0px",
                "style": "none",
                "color": "#4c4c4c"
            },
            "margin": {
                "bottom": "40px",
                "top": "40px"
            },
            "padding": {
                "top": "20px",
                "left": "20px",
                "right": "20px",
                "bottom": "20px"
            },
            "shadow": {
                "visibility": "1"
            }
        },
        "container": {
            "padding": {
                "horizontal": "8px",
                "vertical": "8px"
            },
            "computedHorizontalPadding": 8
        },
        "control": {
            "border": {
                "width": "0px",
                "style": "none",
                "radius": "0px"
            },
            "disabled": {
                "background": {
                    "color": "transparent"
                },
                "border": {
                    "color": "transparent"
                }
            },
            "focused": {
                "background": {
                    "color": "rgba(204,204,204,.4)"
                },
                "border": {
                    "color": "transparent"
                }
            },
            "selected": {
                "background": {
                    "color": "rgba(204,204,204,.4)"
                },
                "border": {
                    "color": "transparent"
                }
            },
            "error": {
                "background": {
                    "color": "transparent"
                },
                "border": {
                    "color": "transparent"
                }
            },
            "hover": {
                "background": {
                    "color": "rgba(204,204,204,.2)"
                },
                "border": {
                    "color": "transparent"
                }
            },
            "normal": {
                "background": {
                    "color": "transparent"
                },
                "border": {
                    "color": "transparent"
                }
            }
        },
        "input": {
            "border": {
                "width": "1px",
                "style": "solid",
                "radius": "3px"
            },
            "font": {
                "family": "'Open Sans', sans-serif",
                "size": "14px",
                "weight": "normal",
                "style": "normal",
                "line": {
                    "height": "1.2em"
                }
            },
            "padding": {
                "vertical": "8px",
                "horizontal": "8px"
            },
            "margin": {
                "vertical": "16px"
            },
            "disabled": {
                "background": {
                    "color": "transparent"
                },
                "border": {
                    "color": "rgba(204,204,204,.5)"
                },
                "color": "rgba(76,76,76,.5)"
            },
            "focused": {
                "background": {
                    "color": "rgba(0,153,204,.1)"
                },
                "border": {
                    "color": "#0099cc"
                },
                "color": "#4c4c4c"
            },
            "selected": {
                "background": {
                    "color": "rgba(0,153,204,.1)"
                },
                "border": {
                    "color": "#0099cc"
                },
                "color": "#4c4c4c"
            },
            "error": {
                "background": {
                    "color": "rgba(250,72,72,.11)"
                },
                "border": {
                    "color": "#fa4848"
                },
                "color": "#4c4c4c"
            },
            "hover": {
                "background": {
                    "color": "transparent"
                },
                "border": {
                    "color": "#0099cc"
                },
                "color": "#4c4c4c"
            },
            "normal": {
                "background": {
                    "color": "transparent"
                },
                "border": {
                    "color": "#cccccc"
                },
                "color": "#4c4c4c"
            }
        },
        "checkbox": {
            "width": "16px",
            "height": "16px",
            "margin": "8px"
        },
        "radio": {
            "width": "16px",
            "height": "16px",
            "margin": "8px",
            "appearance": ""
        },
        "label": {
            "padding": {
                "top": "10px",
                "bottom": "8px"
            },
            "margin": {
                "top": "0px",
                "bottom": "0px"
            },
            "disabled": {
                "color": "rgba(76,76,76,.5)"
            },
            "focused": {
                "color": "#4c4c4c"
            },
            "selected": {
                "color": "#4c4c4c"
            },
            "error": {
                "color": "#4c4c4c"
            },
            "hover": {
                "color": "#4c4c4c"
            },
            "normal": {
                "color": "#4c4c4c"
            }
        },
        "instructions": {
            "font": {
                "family": "'Open Sans', sans-serif",
                "size": "12px",
                "weight": "normal",
                "style": "normal",
                "line": {
                    "height": "1.2em"
                }
            },
            "padding": {
                "top": "4px",
                "bottom": "0px"
            },
            "margin": {
                "top": "0px",
                "bottom": "0px"
            },
            "disabled": {
                "color": "rgba(170,170,170,.5)"
            },
            "focused": {
                "color": "#aaaaaa"
            },
            "selected": {
                "color": "#aaaaaa"
            },
            "hover": {
                "color": "#aaaaaa"
            },
            "error": {
                "color": "#aaaaaa"
            },
            "normal": {
                "color": "#aaaaaa"
            }
        },
        "error": {
            "font": {
                "family": "'Open Sans', sans-serif",
                "size": "12px",
                "weight": "normal",
                "style": "normal",
                "line": {
                    "height": "1.2em"
                }
            },
            "padding": {
                "top": "4px",
                "bottom": "0px"
            },
            "normal": {
                "color": "#fa4848"
            }
        },
        "button": {
            "font": {
                "family": "'Open Sans', sans-serif",
                "size": "14px",
                "weight": "normal",
                "style": "normal",
                "line": {
                    "height": "2em"
                }
            },
            "padding": {
                "vertical": "8px",
                "horizontal": "40px"
            },
            "border": {
                "width": "1px",
                "style": "solid",
                "radius": "3px"
            },
            "primary": {
                "normal": {
                    "border": {
                        "color": "transparent"
                    },
                    "background": {
                        "color": "#4c4c4c"
                    },
                    "color": "#ffffff"
                },
                "hover": {
                    "border": {
                        "color": "transparent"
                    },
                    "background": {
                        "color": "#707070"
                    },
                    "color": "#ffffff"
                },
                "disabled": {
                    "border": {
                        "color": "transparent"
                    },
                    "background": {
                        "color": "rgba(76,76,76,.5)"
                    },
                    "color": "#ffffff"
                }
            },
            "secondary": {
                "normal": {
                    "border": {
                        "color": "#4c4c4c"
                    },
                    "background": {
                        "color": "transparent"
                    },
                    "color": "#4c4c4c"
                },
                "hover": {
                    "border": {
                        "color": "transparent"
                    },
                    "background": {
                        "color": "#4c4c4c"
                    },
                    "color": "#ffffff"
                },
                "disabled": {
                    "border": {
                        "color": "rgba(76,76,76,.5)"
                    },
                    "background": {
                        "color": "transparent"
                    },
                    "color": "rgba(76,76,76,.5)"
                }
            }
        },
        "grid": {
            "pageWidth": 640,
            "pageWidthWithoutPadding": 600,
            "columnWidth": 14,
            "columnSpacing": 16,
            "paddingLeft": 20,
            "paddingRight": 20,
            "paddingTop": 20,
            "paddingBottom": 20,
            "isEnabled": true,
            "spaceReservedForColumnSpacing": 290
        },
        "other": {
            "forcePagebreaks": false
        },
        "cols": [
            {
                "colspan": 1,
                "width": 30,
                "quarter": -16,
                "third": -16,
                "half": -16,
                "full": 14,
                "widthWithoutPadding": 14,
                "additionalCSSClass": "1u"
            },
            {
                "colspan": 2,
                "width": 60,
                "quarter": -16,
                "third": -16,
                "half": 14,
                "full": 44,
                "widthWithoutPadding": 44,
                "additionalCSSClass": "2u"
            },
            {
                "colspan": 3,
                "width": 90,
                "quarter": -16,
                "third": 14,
                "half": 14,
                "full": 74,
                "widthWithoutPadding": 74,
                "additionalCSSClass": "3u"
            },
            {
                "colspan": 4,
                "width": 120,
                "quarter": 14,
                "third": 14,
                "half": 44,
                "full": 104,
                "widthWithoutPadding": 104,
                "additionalCSSClass": "4u"
            },
            {
                "colspan": 5,
                "width": 150,
                "quarter": 14,
                "third": 14,
                "half": 44,
                "full": 134,
                "widthWithoutPadding": 134
            },
            {
                "colspan": 6,
                "width": 180,
                "quarter": 14,
                "third": 44,
                "half": 74,
                "full": 164,
                "widthWithoutPadding": 164
            },
            {
                "colspan": 7,
                "width": 210,
                "quarter": 14,
                "third": 44,
                "half": 74,
                "full": 194,
                "widthWithoutPadding": 194
            },
            {
                "colspan": 8,
                "width": 240,
                "quarter": 44,
                "third": 44,
                "half": 104,
                "full": 224,
                "widthWithoutPadding": 224
            },
            {
                "colspan": 9,
                "width": 270,
                "quarter": 44,
                "third": 74,
                "half": 104,
                "full": 254,
                "widthWithoutPadding": 254
            },
            {
                "colspan": 10,
                "width": 300,
                "quarter": 44,
                "third": 74,
                "half": 134,
                "full": 284,
                "widthWithoutPadding": 284
            },
            {
                "colspan": 11,
                "width": 330,
                "quarter": 44,
                "third": 74,
                "half": 134,
                "full": 314,
                "widthWithoutPadding": 314
            },
            {
                "colspan": 12,
                "width": 360,
                "quarter": 74,
                "third": 104,
                "half": 164,
                "full": 344,
                "widthWithoutPadding": 344
            },
            {
                "colspan": 13,
                "width": 390,
                "quarter": 74,
                "third": 104,
                "half": 164,
                "full": 374,
                "widthWithoutPadding": 374
            },
            {
                "colspan": 14,
                "width": 420,
                "quarter": 74,
                "third": 104,
                "half": 194,
                "full": 404,
                "widthWithoutPadding": 404
            },
            {
                "colspan": 15,
                "width": 450,
                "quarter": 74,
                "third": 134,
                "half": 194,
                "full": 434,
                "widthWithoutPadding": 434
            },
            {
                "colspan": 16,
                "width": 480,
                "quarter": 104,
                "third": 134,
                "half": 224,
                "full": 464,
                "widthWithoutPadding": 464
            },
            {
                "colspan": 17,
                "width": 510,
                "quarter": 104,
                "third": 134,
                "half": 224,
                "full": 494,
                "widthWithoutPadding": 494
            },
            {
                "colspan": 18,
                "width": 540,
                "quarter": 104,
                "third": 164,
                "half": 254,
                "full": 524,
                "widthWithoutPadding": 524
            },
            {
                "colspan": 19,
                "width": 570,
                "quarter": 104,
                "third": 164,
                "half": 254,
                "full": 554,
                "widthWithoutPadding": 554
            },
            {
                "colspan": 20,
                "width": 600,
                "quarter": 134,
                "third": 164,
                "half": 284,
                "full": 584,
                "widthWithoutPadding": 584
            }
        ]
    }
}