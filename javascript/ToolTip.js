define([], function() {
    'use strict';

    /**
     * Tooltip
     *
     * ##Options
     *
     * - positon, one of auto, top, bottom, left and right
     * - className, additional class names of the tooltip
     *
     * 
     * @param {[type]} content [description]
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    var Tooltip = function (content, element, options) {

        var directions = ['auto', 'top', 'bottom', 'left', 'right'];

        this.content = content;
        this.element = element;
        this.options = {
            'classNames': [],
            'position': 'top'
        };

        // extend/override the native options
        if (options) {
            Object.keys(options).forEach(function (opt) {
                this.options[opt] = options[opt];
            }.bind(this));
        }

        // check to make sure the position is valid
        if (directions.indexOf(this.options.position) === -1) {
            throw 'Position is not valid, please choose either auto, top, bottom, left or right';
        }

        // do everything
        this._render()._position();
    };

    /**
     * Render
     *
     * Render the tooltip
     * 
     * @return {[type]} [description]
     */
    Tooltip.prototype._render = function () {

        var classNames = ['dsb-tooltip', this.options.position].concat(this.options.classNames);

        // create the element
        this.tooltip = document.createElement('div');

        classNames.forEach(function (c) {
            this.tooltip.classList.add(c);
        }.bind(this));
        // populate the content
        this.tooltip.innerHTML = '<div class="close"></div>';

        if (typeof this.content === 'string') {
            this.tooltip.innerHTML = 
                '<div class="message">' + this.content + '</div>';
        } else {
            var message = document.createElement('div');
            message.className = 'message';
            message.appendChild(this.content);
            this.tooltip.appendChild(message);
        }

        // need to append the item to calculate the height
        document.body.appendChild(this.tooltip);

        setTimeout(function () {
            this.tooltip.classList.add('active');
        }.bind(this), 100);

        return this;
    };

    /**
     * Position
     *
     * Once the tooltip has been rendered we need to position it next to the
     * element.
     */
    Tooltip.prototype._position = function () {

        var bodyRect = document.body.getBoundingClientRect(),
            elementRect = this.element.getBoundingClientRect(),
            tooltipRect = this.tooltip.getBoundingClientRect(),
            offsetTop = elementRect.top - bodyRect.top,
            offsetLeft = elementRect.left - bodyRect.left;

        // adjust the position depending on where we want it
        switch(this.options.position) {
            case 'top':
                offsetTop -= tooltipRect.height;
                break;
            case 'left':
                offsetLeft -= tooltipRect.width;
                break;
            case 'right':
                offsetLeft += elementRect.width;
                break;
            case 'bottom':
                offsetTop += elementRect.height;
                break;

        }
        // apply to the tooltip
        this.tooltip.style.left = offsetLeft + 'px';
        this.tooltip.style.top = offsetTop + 'px';
        return this;
    };
    
    /**
     * Get ToolTip
     *
     * Returns the pointer to the HTML Element
     */
    Tooltip.prototype.getToolTip = function () {
        return this.tooltip;
    };

    /**
     * Is Descendant
     *
     * Determine whether a given element is a descendant for the tooltip.
     * 
     * @param  {[type]}  element [description]
     * @return {Boolean}         [description]
     */
    Tooltip.prototype.isDescendant = function (element) {
        while (element) {
            if (element === this.tooltip) {
                return true;
            }
            // reached the top
            if (!element.parentNode) {
                return false;
            }
            element = element.parentNode;
        }
    };

    /**
     * Remove
     *
     * Remove the Tooltip
     * 
     * @return null
     */
    Tooltip.prototype.remove = function () {
        if (this.tooltip && this.tooltip.parentNode) {

            this.tooltip.classList.remove('active');
            setTimeout(function () {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }.bind(this), 500);
        }
        return null;
    };

    return Tooltip;
});
