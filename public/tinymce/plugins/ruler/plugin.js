// RULER
const CLASS_RULER = "document-ruler"
const RULER_PAGEBREAK_CLASS = "mce-ruler-pagebreak"
const RULER_SHORTCUT = "Meta+Q"
const PX_RULER = 3.78 // 3.779527559
const PADDING_RULER = 13 // in millimeters
const FORMAT = { width: 210, height: 297 } // A4 210, 297
const HEIGHT = FORMAT.height * PX_RULER
const STYLE_RULER = `
 html.${CLASS_RULER}{
   background: #f4f4f4;
   padding: 0;
   background-image: url(data:image/svg+xml;utf8,%3Csvg%20width%3D%22100%25%22%20height%3D%22${
     FORMAT.height
   }mm%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cline%20x1%3D%220%22%20y1%3D%22${
  FORMAT.height
}mm%22%20x2%3D%22100%25%22%20y2%3D%22${
  FORMAT.height
}mm%22%20stroke%3D%22%23${"737373"}%22%20height%3D%221px%22%2F%3E%3C%2Fsvg%3E);
   background-repeat: repeat-y;
   background-position: 0 0;
 }
 html.${CLASS_RULER} body{
   padding: 0 ${PADDING_RULER}mm !important;
   padding-top: ${PADDING_RULER}mm !important;
   margin: 0 auto !important;
   background-image: url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22${
     FORMAT.width
   }mm%22%20height%3D%22${FORMAT.height}mm%22%3E%3Crect%20width%3D%22${
  FORMAT.width
}mm%22%20height%3D%22${
  FORMAT.height
}mm%22%20style%3D%22fill%3A%23fff%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22100%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%20stroke%3D%22%23737373%22%20height%3D%221px%22%2F%3E%3Cline%20x1%3D%22${PADDING_RULER}mm%22%20y1%3D%220%22%20x2%3D%22${PADDING_RULER}mm%22%20y2%3D%22100%25%22%20stroke%3D%22%230168e1%22%20height%3D%221px%22%20stroke-dasharray%3D%225%2C5%22%2F%3E%3Cline%20x1%3D%22${
  FORMAT.width - PADDING_RULER
}mm%22%20y1%3D%220%22%20x2%3D%22${
  FORMAT.width - PADDING_RULER
}mm%22%20y2%3D%22100%25%22%20stroke%3D%22%230168e1%22%20height%3D%221px%22%20stroke-dasharray%3D%225%2C5%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22${PADDING_RULER}mm%22%20x2%3D%22100%25%22%20y2%3D%22${PADDING_RULER}mm%22%20stroke%3D%22%230168e1%22%20height%3D%221px%22%20stroke-dasharray%3D%225%2C5%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22${
  FORMAT.height - PADDING_RULER
}mm%22%20x2%3D%22100%25%22%20y2%3D%22${
  FORMAT.height - PADDING_RULER
}mm%22%20stroke%3D%22%230168e1%22%20height%3D%221px%22%20stroke-dasharray%3D%225%2C5%22%2F%3E%3C%2Fsvg%3E);
   background-repeat: repeat-y;
   background-position: 0 0;
   width: ${FORMAT.width}mm;
   min-height: ${FORMAT.height}mm !important;
   box-sizing: border-box;
   box-shadow: 4px 4px 13px -3px #3c3c3c;
   -webkit-box-shadow: 4px 4px 13px -3px #3c3c3c;
 }
 html.${CLASS_RULER} .${RULER_PAGEBREAK_CLASS}{
   margin-top: ${PADDING_RULER}mm;
   margin-bottom: ${PADDING_RULER}mm;
   margin-left: -${PADDING_RULER}mm;
   width: calc(100% + ${2 * PADDING_RULER}mm);
   border: 0;
   height: 1px;
   background: #5a8ecb;
 }

 @media print {
   @page {
     size: ${FORMAT.width}mm ${FORMAT.height}mm;
     margin: ${PADDING_RULER}mm !important;
     counter-increment: page
   }
   html.${CLASS_RULER}, html.${CLASS_RULER} body {
     background: transparent;
     box-shadow: none
   }
   html.${CLASS_RULER} body {
     padding: 0 !important;
     width: 100%;
     font-size: 13px;
     font-family: Helvetica,Arial,sans-serif !important;
     font-style: normal;
     letter-spacing: 0
   }
   html.${CLASS_RULER} .${RULER_PAGEBREAK_CLASS}{
     margin: 0 !important;
     height: 0 !important
   }
 }
`

function debounce(fn, wait = 250, immediate) {
  let timeout

  function debounced(/* ...args */) {
    const later = () => {
      timeout = void 0
      if (immediate !== true) {
        fn.apply(this, arguments)
      }
    }

    clearTimeout(timeout)
    if (immediate === true && timeout === void 0) {
      fn.apply(this, arguments)
    }
    timeout = setTimeout(later, wait)
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
  }

  return debounced
}

function createStyle(style, doc) {
  const tag = doc.createElement("style")
  tag.innerHTML = style
  doc.head.appendChild(tag)
}
const pluginManager = tinymce.util.Tools.resolve("tinymce.PluginManager")

function pluginRuler(editor) {
  if (editor.settings.ruler !== true) {
    return void 0
  }
  const tinyEnv = window.tinymce.util.Tools.resolve("tinymce.Env")

  const FilterContent = {
    getPageBreakClass() {
      return RULER_PAGEBREAK_CLASS
    },
    getPlaceholderHtml() {
      return (
        '<img src="' +
        tinyEnv.transparentSrc +
        '" class="' +
        this.getPageBreakClass() +
        '" data-mce-resize="false" data-mce-placeholder />'
      )
    },
  }

  const Settings = {
    getSeparatorHtml() {
      return editor.getParam("pagebreak_separator", "<!-- ruler-pagebreak -->") // <!-- pagebreak -->
    },
    shouldSplitBlock() {
      return editor.getParam("pagebreak_split_block", false)
    },
  }

  const separatorHtml = Settings.getSeparatorHtml(editor)
  var pageBreakSeparatorRegExp = new RegExp(
    separatorHtml.replace(/[\?\.\*\[\]\(\)\{\}\+\^\$\:]/g, function (a) {
      return "\\" + a
    }),
    "gi",
  )
  editor.on("BeforeSetContent", function (e) {
    e.content = e.content.replace(
      pageBreakSeparatorRegExp,
      FilterContent.getPlaceholderHtml(),
    )
  })
  editor.on("PreInit", function () {
    editor.serializer.addNodeFilter("img", function (nodes) {
      var i = nodes.length,
        node,
        className
      while (i--) {
        node = nodes[i]
        className = node.attr("class")
        if (
          className &&
          className.indexOf(FilterContent.getPageBreakClass()) !== -1
        ) {
          const parentNode = node.parent
          if (
            editor.schema.getBlockElements()[parentNode.name] &&
            Settings.shouldSplitBlock(editor)
          ) {
            parentNode.type = 3
            parentNode.value = separatorHtml
            parentNode.raw = true
            node.remove()
            continue
          }
          node.type = 3
          node.value = separatorHtml
          node.raw = true
        }
      }
    })
  })

  editor.on("ResolveName", function (e) {
    if (
      e.target.nodeName === "IMG" &&
      editor.dom.hasClass(e.target, FilterContent.getPageBreakClass())
    ) {
      e.name = "pagebreak"
    }
  })

  editor.addCommand("mceRulerPageBreak", function () {
    if (editor.settings.pagebreak_split_block) {
      editor.insertContent("<p>" + FilterContent.getPlaceholderHtml() + "</p>")
    } else {
      editor.insertContent(FilterContent.getPlaceholderHtml())
    }
  })

  editor.addCommand("mceRulerRecalculate", function () {
    const $document = editor.getDoc()
    const $breaks = $document.querySelectorAll(`.${RULER_PAGEBREAK_CLASS}`)
    for (let i = 0; i < $breaks.length; i++) {
      const $element = $breaks[i]
      const $parent = $element.parentElement
      const offsetTop = $element.offsetTop
      const top = HEIGHT * (i + 1)
      if (top >= offsetTop) {
        $parent.style.marginTop =
          ~~(top - (offsetTop - $parent.style.marginTop.replace("px", ""))) +
          "px"
      }
    }
  })

  editor.addShortcut(RULER_SHORTCUT, "", "mceRulerPageBreak")

  editor.on("init", (e) => {
    const $document = editor.getDoc()
    createStyle(STYLE_RULER, $document)
    const documentElement = $document.documentElement
    const hasRuler = documentElement.classList.contains(CLASS_RULER)

    if (hasRuler === false) {
      documentElement.classList.add(CLASS_RULER)
    }
  })

  const recalculate = debounce(() => {
    editor.execCommand("mceRulerRecalculate")
  }, 100)

  editor.on("NodeChange", (e) => {
    recalculate()
  })
}

tinymce.PluginManager.add("ruler", pluginRuler)

function pluginMath(editor) {
  // Create API
  // https://github.com/mathjax/MathJax-src#using-mathjax-components-in-node-applications
  // https://github.com/uetchy/math-api/blob/master/index.ts

  // https://github.com/mathjax/MathJax-demos-node/blob/master/direct/tex2svg
  const apiMath = "https://math.now.sh/?from=" // 'https://chart.googleapis.com/chart?cht=tx&chf=a,s,000000|bg,s,FFFFFF00&chl='

  const getSrc = function (text) {
    const textURI = window
      .encodeURIComponent(text)
      .replace(/[!'()]/g, escape)
      .replace(/\*/g, "%2A")
    return apiMath + textURI
  }

  const createSrc = function (text, width = 0, height = 0) {
    const widthAttr = width > 0 ? `width="${width}" ` : ""
    const heightAttr = height > 0 ? `height="${height}" ` : ""
    return `<img src="${getSrc(
      text,
    )}" data-mce-math="true" ${widthAttr}${heightAttr}/>`
  }

  const isMath = function (node) {
    return (
      node !== void 0 &&
      node.nodeName === "IMG" &&
      node.dataset !== void 0 &&
      node.dataset.mceMath === "true"
    )
  }

  const getMath = function (node) {
    if (isMath(node) === true) {
      const textMath = node.dataset.mceSrc
      return {
        value: window.decodeURIComponent(String(textMath).replace(apiMath, "")),
        width: +node.getAttribute("width"),
        height: +node.getAttribute("height"),
      }
    }
    return {
      value: "",
      width: 0,
      height: 0,
    }
  }

  const generateMatrix = function generateMatrix(type, rows, columns) {
    let res = "\\begin{" + type + "}\n"
    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= columns; j++) {
        res += "#?"
        if (j !== columns) {
          res += " & "
        }
      }
      if (i !== rows) {
        res += " \\\\"
      }
      res += "\n"
    }
    return res + "\\end{" + type + "}"
  }

  const Dialog = (editor) => {
    return async () => {
      let configMath
      if (editor.selection !== void 0 && editor.selection.getNode !== void 0) {
        configMath = getMath(editor.selection.getNode())
      } else {
        configMath = {
          value: "",
          width: 0,
          height: 0,
        }
      }
      const inputName = "math"
      const inputId = `input_${inputName}_${Date.now()}`
      let $keyboard
      const $modal = editor.windowManager.open({
        title: "Formula",
        body: {
          type: "panel",
          items: [
            {
              name: inputName,
              type: "htmlpanel",
              html: `<div class="mathlive-input" id="${inputId}"></div>`,
            },
          ],
        },
        initialData: {
          [inputName]: configMath.value, // Ya no funciona, hasta mejorar type:htmlpanel
        },
        buttons: [
          {
            type: "cancel",
            name: "cancel",
            text: "Cancel",
          },
          {
            type: "submit",
            name: "save",
            text: "Save",
            primary: true,
          },
        ],
        onSubmit(e) {
          const $input = window.document.querySelector(`#${inputId}`)
          const text = $input.mathfield.$text("latex")
          if (text && typeof text.trim === "function") {
            const img = createSrc(
              text
                .trim()
                .replace(/\\mleft\./g, "")
                .replace(/\\mright\./g, ""),
              configMath.width,
              configMath.height,
            )
            editor.focus()
            editor.insertContent(img)
          } else {
            editor.focus()
          }
          e.close()
          // const html = katex.renderToString(text, {throwOnError: false})
          // editor.insertContent(e.data[input])
        },
        onClose(e) {
          // const $input = window.document.querySelector(`#${inputId}`)
          if ($keyboard !== void 0) {
            $keyboard.remove()
          }
        },
      })
      $modal.block("Loading...")

      /** Loading MathLive Dynamic */
      /*const chunkMathLive = new Promise(resolve => {
        require.ensure([], require => {
          require("../mathlive/mathlive.main.scss");
          require("../mathlive/mathlive.min.js");
          resolve();
        });
      });*/
      try {
        // await chunkMathLive;
        setTimeout(() => {
          const $input = window.document.querySelector(`#${inputId}`) // window.document.querySelector('.tox-textfield')
          const $dialog = $input.closest(".tox-dialog")
          $dialog.classList.add("mathlive")

          window.MathLive.makeMathField($input, {
            smartFence: false,
            virtualKeyboardMode: "manual",
            onContentDidChange() {
              // $modal.setData({ [inputName]: $input.mathfield.$text('latex') })
            },
            onVirtualKeyboardToggle(instance, toggle, element) {
              $keyboard = element
            },
            customVirtualKeyboardLayers: {
              math: `
        <div class='rows'>
            <ul>
                <li class='keycap tex' data-alt-keys='x-var'><i>x</i></li>
                <li class='keycap tex' data-alt-keys='n-var'><i>n</i></li>
                <li class='separator w5'></li>
                <row name='numpad-1'/>
                <li class='separator w5'></li>
                <li class='keycap tex' data-key='ee' data-alt-keys='ee'>e</li>
                <li class='keycap tex' data-key='ii' data-alt-keys='ii'>i</li>
                <li class='keycap tex' data-latex='\\pi' data-alt-keys='numeric-pi'></li>
            </ul>
            <ul>
                <li class='keycap tex' data-key='<' data-alt-keys='<'>&lt;</li>
                <li class='keycap tex' data-key='>' data-alt-keys='>'>&gt;</li>
                <li class='separator w5'></li>
                <row name='numpad-2'/>
                <li class='separator w5'></li>
                <li class='keycap tex' data-alt-keys='x2' data-insert='#@^{2}'><span><i>x</i>&thinsp;²</span></li>
                <li class='keycap tex' data-alt-keys='^' data-insert='#@^{#?}'><span><i>x</i><sup>&thinsp;<small>&#x2b1a;</small></sup></span></li>
                <li class='keycap tex' data-alt-keys='sqrt' data-insert='\\sqrt{#0}' data-latex='\\sqrt{#0}'></li>
            </ul>
            <ul>
                <li class='keycap tex' data-alt-keys='(' >(</li>
                <li class='keycap tex' data-alt-keys=')' >)</li>
                <li class='separator w5'></li>
                <row name='numpad-3'/>
                <li class='separator w5'></li>
                <li class='keycap tex small' data-alt-keys='int' data-latex='\\int_0^\\infty'><span></span></li>
                <li class='keycap tex' data-latex='\\frac{#0}{#?}' data-alt-keys='logic' ></li>
                <li class='action font-glyph bottom right' data-alt-keys='delete' data-command='["performWithFeedback","deletePreviousChar"]'>&#x232b;</li></ul>
            </ul>
            <ul>
                <li class='keycap' data-alt-keys='foreground-color' data-command='["applyStyle",{"color":"#cc2428"}]'><span style='border-radius: 50%;width:22px;height:22px; border: 3px solid #cc2428; box-sizing: border-box'></span></li>
                <li class='keycap' data-alt-keys='background-color' data-command='["applyStyle",{"backgroundColor":"#fff590"}]'><span style='border-radius: 50%;width:22px;height:22px; background:#fff590; box-sizing: border-box'></span></li>
                <li class='separator w5'></li>
                <row name='numpad-4'/>
                <li class='separator w5'></li>
                <arrows/>
            </ul>
        </div>
    `,
              functions: `
        <div class='rows'>
                  <ul><li class='separator'></li>
                      <li class='fnbutton small' data-insert='\\sin #?'></li>
                      <li class='fnbutton small' data-insert='\\sin^{-1} #?'></li>
                      <li class='fnbutton small' data-insert='\\ln #?'></li>
                      <li class='fnbutton small' data-insert='\\exponentialE^{#?}'></li>
                      <li class='fnbutton small' data-insert='\\operatorname{lcm}(#?)'></li>
                      <li class='fnbutton small' data-insert='\\operatorname{ceil}(#?)'></li>
                      <li class='fnbutton small' data-insert='\\lim_{n\\to\\infty} #?'></li>
                      <li class='fnbutton small' data-insert='\\int_{#?}^{#?}'></li>
                      <li class='fnbutton small' data-insert='\\operatorname{abs}(#?)'></li>
                  </ul>
                  <ul><li class='separator'></li>
                      <li class='fnbutton small' data-insert='\\cos #?'></li>
                      <li class='fnbutton small' data-insert='\\cos^{-1} #?'></li>
                      <li class='fnbutton small' data-insert='\\ln_{10} #?'></li>
                      <li class='fnbutton small' data-insert='10^{#?}'></li>
                      <li class='fnbutton small' data-insert='\\operatorname{gcd}(#?)'></li>
                      <li class='fnbutton small' data-insert='\\operatorname{floor}(#?)'></li>
                      <li class='fnbutton small' data-insert='\\sum_{n\\mathop=0}^{\\infty}'></li>
                      <li class='fnbutton small' data-insert='\\int_{0}^{\\infty}'></li>
                      <li class='fnbutton small' data-insert='\\operatorname{sign}(#?)'></li>
                  </ul>
                  <ul><li class='separator'></li>
                      <li class='fnbutton small' data-insert='\\tan #?'></li>
                      <li class='fnbutton small' data-insert='\\tan^{-1} #?'></li>
                      <li class='fnbutton small' data-insert='\\log_{#?} #0'></li>
                      <li class='fnbutton small' data-insert='\\sqrt[#?]{#0}'></li>
                      <li class='fnbutton small' data-insert='#0 \\mod' data-latex='\\mod'></li>
                      <li class='fnbutton small' data-insert='\\operatorname{round}(#?)'></li>
                      <li class='bigfnbutton' data-insert='\\prod_{n\\mathop=0}^{\\infty}' data-latex='{\\tiny \\prod_{n=0}^{\\infty}}'></li>
                      <li class='bigfnbutton' data-insert='\\frac{\\differentialD #0}{\\differentialD x}'></li>
                      <li class='action font-glyph bottom right' data-command='["performWithFeedback","deletePreviousChar"]'>&#x232b;</li></ul>
                  <ul><li class='separator'></li>
                      <li class='fnbutton'>(</li>
                      <li class='fnbutton'>)</li>
                      <li class='fnbutton' data-insert='^{#?} ' data-latex='x^{#?} '></li>
                      <li class='fnbutton' data-insert='_{#?} ' data-latex='x_{#?} '></li>
                      <li class='keycap w20 ' data-key=' '>&nbsp;</li>
                      <arrows/>
                  </ul>
              </div>`,
              matrix: {
                rows: [
                  [
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("matrix", 1, 2),
                    },
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("matrix", 2, 1),
                    },
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("matrix", 1, 3),
                    },
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("matrix", 3, 1),
                    },
                  ],
                  [
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("matrix", 2, 2),
                    },
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("matrix", 2, 3),
                    },
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("matrix", 3, 2),
                    },
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("matrix", 3, 3),
                    },
                  ],
                  [
                    {
                      class: "keycap tex small w15",
                      insert: "\\cdots",
                    },
                    {
                      class: "keycap tex small w15",
                      insert: "\\ldots",
                    },
                    {
                      class: "keycap tex small w15",
                      insert: "\\vdots",
                    },
                    {
                      class: "keycap tex small w15",
                      insert: "\\ddots",
                    },
                  ],
                  [
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("pmatrix", 2, 2),
                    },
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("bmatrix", 2, 2),
                    },
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("vmatrix", 2, 2),
                    },
                    {
                      class: "keycap tex small w15",
                      insert: generateMatrix("Vmatrix", 2, 2),
                    },
                  ],
                ],
              },
            },
            customVirtualKeyboards: {
              qmatrix: {
                label:
                  '<svg viewBox="0 2 60 35" style="width: 45px; height: 25px"><text x="0" y="15">⎡ ⬚ ⬚ ⎤</text><text x="0" y="30">⎣ ⬚ ⬚ ⎦</text></svg>',
                tooltip: "Matrix keyboard",
                layer: "matrix",
              },
            },
            virtualKeyboards: "numeric roman greek functions command qmatrix",
          })
          $input.mathfield.$focus()
          $input.mathfield.$latex(configMath.value)
          setTimeout(() => $modal.unblock())
        }, 0)
      } catch (error) {
        $modal.unblock()
      }
    }
  }

  /* const toggleActiveState = function (buttonApi, editor) {
  return function () {
    const self = this
    editor.on('nodechange', function (e) {
      self.active(!editor.readonly && !!isMath(e.element))
    })
  }
} */

  const registry = editor.ui.registry

  editor.addCommand("mceMath", Dialog(editor))

  registry.addToggleButton("math", {
    // text: 'Math',
    icon: "superscript", //character-count
    tooltip: "Fórmula",
    onAction: () => editor.execCommand("mceMath"),
    onSetup: (buttonApi) => {
      const toggleActiveState = (e) =>
        buttonApi.setActive(!editor.readonly && isMath(e.element) === true)
      editor.on("NodeChange", toggleActiveState)
    },
  })

  // Verificar bien este proceso
  editor.on("PastePreProcess", (e) => {
    const text = e.content
    const characters = ["\\", "^"]
    let includeChar = false
    for (let i = 0; i < characters.length; i++) {
      if (text.indexOf(characters[i]) >= 0) {
        includeChar = true
        break
      }
    }

    if (text && includeChar) {
      try {
        e.content = createSrc(e.content)
      } catch (error) {
        console.error(error)
      }
    }
  })

  registry.addMenuItem("math", {
    icon: "superscript",
    text: "Editar fórmula",
    onAction: () => editor.execCommand("mceMath"),
  })

  registry.addContextMenu("math", {
    update(element) {
      if (isMath(element) === true) {
        return "math"
      }
    },
  })
}

tinymce.PluginManager.add("math", pluginMath)
