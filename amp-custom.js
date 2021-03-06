const CleanCSS = require('clean-css')

class AmpCustom {
  constructor (option) {
    this.MAX_BYTE = 75000
    this.encode = 'utf-8'
    this.removeStyles = [
      /@charset (.+?);/g,
      /@import (.+?);/g,
      /@namespace (.+?);/g,
      /@viewport ([\s\S]*?)}/gm,
      /@-ms-viewport ([\s\S]*?)}/gm,
      /@page ([\s\S]*?)}/gm,
      /@document(.+?)\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/gm,
      /@supports(.+?)\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/gm,
      /!important/g
    ]
    this.cleanCss = new CleanCSS(option)
  }

  /**
     * getSize
     * @param {string} cssSource - CSS source you want to measure.
     * @returns {number|boolean} - Number of bytes in CSS source.
     */
  getSize (cssSource) {
    if (!cssSource) {
      console.error(new Error('Error: CSS source is not a string.'))

      return false
    }

    return Buffer.byteLength(cssSource, this.encode)
  }

  /**
     * isOverMaxByte
     * @param {string} cssSource - CSS source you want to check.
     * @return {boolean} - Whether the CSS byte capacity does not exceed the maximum value.
     */
  isOverMaxByte (cssSource) {
    if (typeof cssSource !== 'string') {
      return false
    }

    if (this.getSize(cssSource) > this.MAX_BYTE) {
      return true
    }

    return false
  }

  /**
     * optimize
     * @param {string} cssSource - CSS source you want to optimize.
     * @return {string} - Optimized CSS source.
     */
  optimize (cssSource) {
    if (typeof cssSource !== 'string') {
      return cssSource
    }

    this.removeStyles.forEach((style) => {
      cssSource = cssSource.replace(style, '')
    })

    return this.cleanCss.minify(cssSource).styles
  }
}

module.exports = AmpCustom
module.exports.default = AmpCustom
