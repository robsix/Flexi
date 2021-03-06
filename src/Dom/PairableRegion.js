/**
 * User: 0xor1    http://github.com/0xor1
 * Date: 24/04/13
 */

(function(NS){

    var ns = window[NS] = window[NS] || {}
        ;

    ns.PairableRegion = function(child){

        if(child.parent){throw new Error("Trying to adopt child that already has a parent");}
        if(!(child instanceof ns.PairedRegion) && !(child instanceof ns.TabbableRegion)){
            throw new Error("Attempting to add a child to PairableRegion which is not a PairedRegion or TabbableRegion");
        }

        ns.Dom.call(this, { class: 'pairable-region', style: { height: '100%', width: '100%'} });

        this.parent = null;
        this.child = child;
        this.child.parent = this;
        this.domRoot().appendChild(this.child.domRoot());
    };


    ns.PairableRegion.prototype = Object.create(ns.Dom.prototype);


    ns.PairableRegion.prototype.pair = function(pairableRegion, idx, orientation){

        if(pairableRegion.parent){throw new Error("Trying to pair with a region that already has a parent");}
        if(!(pairableRegion instanceof ns.PairableRegion)){throw new Error("Can't pair with a non pairable region");}

        var firstRegion = (idx === 0) ? pairableRegion : this
            , secondRegion = (idx === 0) ? this : pairableRegion
            , oldParent = this.parent
            , newParent
            ;

        this.removeSelf();

        newParent = new ns.PairableRegion(new ns.PairedRegion(firstRegion, secondRegion, orientation))

        if(oldParent){
            oldParent.addChild(newParent);
        }

        return newParent;

    };


    ns.PairableRegion.prototype.unpair = function(){
        if(this.parent instanceof ns.PairedRegion){
            var parent = this.parent
                , sibling = (parent.isFirstChild(this)) ? parent.secondChild : parent.firstChild
                , grandParent = this.parent.parent
                , greatGrandParent = grandParent.parent
                ;

            this.removeSelf();
            sibling.removeSelf();

            if(greatGrandParent){
                greatGrandParent.removeChild(grandParent);
                greatGrandParent.addChild(sibling);
            }
            parent.dispose();
        }else{
            throw new Error("this region is not paired");
        }
        return this;
    };


    ns.PairableRegion.prototype.removeChild = function(child){
        if(this.child === child){
            this.child = null;
            child.parent = null;
            this.domRoot().removeChild(child.domRoot());
        }
    };


    ns.PairableRegion.prototype.showOverlay = function(){
        this.domRoot().appendChild(ns.PairableRegion.pairOverlay.root);
        if(!(this.child instanceof ns.TabbableRegion) || (ns.Layout.current.grabbedFloatingRegion instanceof ns.floatingCustomRegion)){
            removeTabSelector();
        }
    };

    function removeTabSelector(){
        ns.PairableRegion.pairOverlay.domRoot().removeChild(ns.PairableRegion.pairOverlay.tabSelector);
    }

    function replaceTabSelector(){
        ns.PairableRegion.pairOverlay.domRoot().removeChild(ns.PairableRegion.pairOverlay.tabSelector);
    }

    var selSize = ns.Layout.style.selectorSize
        , bRad = ns.Layout.style.regionBorderRadius
        , color = ns.Layout.style.colors.splitter.toStyle()
        ;

    ns.PairableRegion.pairOverlay = ns.Dom.domGenerator({
        id: 'pair-overlay', style: { borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, top:0, left: 0, width: '100%', height: '100%', background: ns.Layout.style.colors.pairedRegionResizeOverlay.toStyle() },
        children: [
            { prop: 'topSelector', id: 'top-selector', style: { borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, top: 'calc( 50% - ' + 2*selSize + 'px)', left: 'calc(50% - '+selSize*0.5+'px)', width: selSize+'px', height: selSize+'px', background: color},
                children: [{style: {left: '4px', top: '4px', right: '4px', bottom: selSize*0.5+'px', borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, background: '#fff'}}]},
            { prop: 'leftSelector', id: 'left-selector', style: { borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, top: 'calc( 50% - ' + 0.5*selSize + 'px)', left: 'calc(50% - '+selSize*2+'px)', width: selSize+'px', height: selSize+'px', background: color},
                children: [{style: {left: '4px', top: '4px', right: selSize*0.5+'px', bottom: '4px', borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, background: '#fff'}}]},
            { prop: 'tabSelector', id: 'tab-selector', style: { borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, top: 'calc( 50% - ' + 0.5*selSize + 'px)', left: 'calc(50% - '+selSize*0.5+'px)', width: selSize+'px', height: selSize+'px', background: color },
                children: [{style: {left: '4px', top: '4px', right: '4px', bottom: '4px', borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, background: '#fff'}}]},
            { prop: 'rightSelector', id: 'right-selector', style: { borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, top: 'calc( 50% - ' + 0.5*selSize + 'px)', left: 'calc(50% + '+selSize+'px)', width: selSize+'px', height: selSize+'px', background: color },
                children: [{style: {left: selSize*0.5+'px', top: '4px', right: '4px', bottom: '4px', borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, background: '#fff'}}]},
            { prop: 'bottomSelector', id: 'bottom-selector', style: { borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, top: 'calc( 50% + ' +selSize + 'px)', left: 'calc(50% - '+0.5*selSize+'px)', width: selSize+'px', height: selSize+'px', background: color },
                children: [{style: {left: '4px', top: selSize*0.5+'px', right: '4px', bottom: '4px', borderRadius: bRad, WebkitBorderRadius: bRad, MozBorderRadius: bRad, background: '#fff'}}]}
        ]
    });

})(NS);