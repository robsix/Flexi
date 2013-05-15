/**
 * User: 0xor1    http://github.com/0xor1
 * Date: 25/04/13
 */

(function(NS){


    var ns = window[NS] = window[NS] || {}
        ;


    ns.Layout = function(layoutConfig){

        if(ns.Layout.current){
            return ns.Layout.current;
        }

        var sWidth = ns.Layout.style.splitterWidth + 'px'
            ;

        ns.Dom.call(this,{
            id: 'layout-root', style: {overflow: 'auto', background: ns.Layout.style.colors.splitter.toStyle() },
            children: [
                { id: 'floating-region-anchor', style: { left:'-100%', overflow: 'visible', background: ns.Layout.style.colors.splitter.toStyle() } },
                { id: 'context-menu-anchor', style: { left:'-100%', overflow: 'visible', background: ns.Layout.style.colors.splitter.toStyle() } },
                { id: 'dialog-box-anchor', style: { left:'-100%', overflow: 'visible', background: ns.Layout.style.colors.splitter.toStyle() } }
            ]
        });

        //add default style for all flexi elements
        var styleNode = document.createElement('style');
        styleNode.appendChild(document.createTextNode('html, body, .' + NS.toLowerCase() + '{position: absolute; top: 0; left: 0; height: 100%; width: 100%; margin: 0; border: 0; padding: 0; overflow: hidden;}'));
        styleNode.type = 'text/css';
        document.head.appendChild(styleNode);

        //clear body
        if(document.body.hasChildNodes()){
            var children = document.body.childNodes;
            for(var i = children.length - 1; i > -1; i--){
                document.body.removeChild(children[i]);
            }
        }

        //actual members
        this.rootRegion = new ns.RootRegion();
        this.selectedRegion = null;
        this.selectedRegions = [];
        this.floatingRegions = [];
        this.windowedRegions = [];
        this.dialogBoxes = [];
        this.contextMenu = null;

        //draw layout to page
        this.dom.insertBefore(this.rootRegion.dom, this.dom.children[0]);
        document.body.appendChild(this.dom);

        ns.Layout.current = this;
    };


    function HSLA(h, s, l, a){
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a || 1;
    }


    HSLA.prototype = {
        toStyle: function(){
            return "hsla("+this.h+", "+this.s+"%, "+this.l+ "%, "+this.a+")";
        }
    };


    function RGBA(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a || 1;
    }


    RGBA.prototype = {
        toStyle: function(){
            return "rgba("+this.r+", "+this.g+", "+this.b+ ", "+this.a+")";
        }
    };


    ns.Layout.style = {
        colors: {
            splitter: new RGBA(48,48,48),
            header: new RGBA(0,0,0),
            tabBar: new RGBA(0,0,0),
            tab: new RGBA(70,70,70),
            selectedTab: new RGBA(150, 70, 0),
            pairedRegionResizeOverlay: new RGBA(200,200,200,0.5)
        },
        splitterWidth: 6,
        tabHeight: '20px',
        headerHeight: '20px'
    };


    ns.Layout.events = {
        resize: 'resize'
    }

    ns.Layout.prototype = Object.create(ns.Dom.prototype);


    ns.Layout.prototype.newRegion = function(domControl){

    };

    ns.Layout.prototype.embedRegion = function(region){
        if(this.rootRegion.child){throw new Error("Cant embed a region as the root Region already contains a child")}
        this.rootRegion.addChild(region);
    };


    ns.Layout.prototype.floatRegion = function(region){
        this.floatingRegions.push(new ns.FloatingRegion(region));
    };

    ns.Layout.prototype.groupRegions = function(first, second, orientation){
        return new ns.GroupedRegion(first, second, orientation);
    };


})(NS);