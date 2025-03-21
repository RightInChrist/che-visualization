import{O as T,V as W,E as Ne,_ as n,s as _,R as F,T as gt,a as D,M as si,L as oi,P as et,S as H,G as ri,b as ne,D as ni,c as O,C as Rt,d as me,e as V,A as pi,f as Qe,g as Ye,K as xi,h as Dt,W as Ii,i as yi,j as Bi,k as Ci,l as st,m as ke,n as ai,o as _i,p as ae,q as Ti,r as zt,t as M,u as L,v as B,w as Wt,x as rt,y as qt}from"./babylon-5P2y78Su.js";class p{constructor(t,e=p.UNITMODE_PIXEL,i=!0){this.negativeValueAllowed=i,this._value=1,this._unit=p.UNITMODE_PIXEL,this.ignoreAdaptiveScaling=!1,this.onChangedObservable=new T,this._value=t,this._unit=e,this._originalUnit=e}get isPercentage(){return this._unit===p.UNITMODE_PERCENTAGE}get isPixel(){return this._unit===p.UNITMODE_PIXEL}get internalValue(){return this._value}get value(){return this._value}set value(t){t!==this._value&&(this._value=t,this.onChangedObservable.notifyObservers())}get unit(){return this._unit}set unit(t){t!==this._unit&&(this._unit=t,this.onChangedObservable.notifyObservers())}getValueInPixel(t,e){return this.isPixel?this.getValue(t):this.getValue(t)*e}updateInPlace(t,e=p.UNITMODE_PIXEL){return(this.value!==t||this.unit!==e)&&(this._value=t,this._unit=e,this.onChangedObservable.notifyObservers()),this}getValue(t){if(t&&!this.ignoreAdaptiveScaling&&this.unit!==p.UNITMODE_PERCENTAGE){let e=0,i=0;if(t.idealWidth&&(e=Math.ceil(this._value*t.getSize().width/t.idealWidth)),t.idealHeight&&(i=Math.ceil(this._value*t.getSize().height/t.idealHeight)),t.useSmallestIdeal&&t.idealWidth&&t.idealHeight)return window.innerWidth<window.innerHeight?e:i;if(t.idealWidth)return e;if(t.idealHeight)return i}return this._value}toString(t,e){switch(this._unit){case p.UNITMODE_PERCENTAGE:{const i=this.getValue(t)*100;return(e?i.toFixed(e):i)+"%"}case p.UNITMODE_PIXEL:{const i=this.getValue(t);return(e?i.toFixed(e):i)+"px"}}return this._unit.toString()}fromString(t){const e=p._Regex.exec(t.toString());if(!e||e.length===0)return!1;let i=parseFloat(e[1]),s=this._originalUnit;if(this.negativeValueAllowed||i<0&&(i=0),e.length===4)switch(e[3]){case"px":s=p.UNITMODE_PIXEL;break;case"%":s=p.UNITMODE_PERCENTAGE,i/=100;break}return i===this._value&&s===this._unit?!1:(this._value=i,this._unit=s,this.onChangedObservable.notifyObservers(),!0)}static get UNITMODE_PERCENTAGE(){return p._UNITMODE_PERCENTAGE}static get UNITMODE_PIXEL(){return p._UNITMODE_PIXEL}}p._Regex=/(^-?\d*(\.\d+)?)(%|px)?/;p._UNITMODE_PERCENTAGE=0;p._UNITMODE_PIXEL=1;const ge=[new W(0,0),new W(0,0),new W(0,0),new W(0,0)],Se=[new W(0,0),new W(0,0),new W(0,0),new W(0,0)],Vt=new W(0,0),re=new W(0,0);class j{constructor(t,e,i,s){this.left=t,this.top=e,this.width=i,this.height=s}copyFrom(t){this.left=t.left,this.top=t.top,this.width=t.width,this.height=t.height}copyFromFloats(t,e,i,s){this.left=t,this.top=e,this.width=i,this.height=s}static CombineToRef(t,e,i){const s=Math.min(t.left,e.left),o=Math.min(t.top,e.top),r=Math.max(t.left+t.width,e.left+e.width),a=Math.max(t.top+t.height,e.top+e.height);i.left=s,i.top=o,i.width=r-s,i.height=a-o}addAndTransformToRef(t,e,i,s,o,r){const a=this.left+e,l=this.top+i,h=this.width+s,f=this.height+o;ge[0].copyFromFloats(a,l),ge[1].copyFromFloats(a+h,l),ge[2].copyFromFloats(a+h,l+f),ge[3].copyFromFloats(a,l+f),Vt.copyFromFloats(Number.MAX_VALUE,Number.MAX_VALUE),re.copyFromFloats(0,0);for(let d=0;d<4;d++)t.transformCoordinates(ge[d].x,ge[d].y,Se[d]),Vt.x=Math.floor(Math.min(Vt.x,Se[d].x)),Vt.y=Math.floor(Math.min(Vt.y,Se[d].y)),re.x=Math.ceil(Math.max(re.x,Se[d].x)),re.y=Math.ceil(Math.max(re.y,Se[d].y));r.left=Vt.x,r.top=Vt.y,r.width=re.x-Vt.x,r.height=re.y-Vt.y}transformToRef(t,e){this.addAndTransformToRef(t,0,0,0,0,e)}isEqualsTo(t){return!(this.left!==t.left||this.top!==t.top||this.width!==t.width||this.height!==t.height)}static Empty(){return new j(0,0,0,0)}}class Xe extends W{constructor(t,e=0){super(t.x,t.y),this.buttonIndex=e}}class w{constructor(t,e,i,s,o,r){this.m=new Float32Array(6),this.fromValues(t,e,i,s,o,r)}fromValues(t,e,i,s,o,r){return this.m[0]=t,this.m[1]=e,this.m[2]=i,this.m[3]=s,this.m[4]=o,this.m[5]=r,this}determinant(){return this.m[0]*this.m[3]-this.m[1]*this.m[2]}invertToRef(t){const e=this.m[0],i=this.m[1],s=this.m[2],o=this.m[3],r=this.m[4],a=this.m[5],l=this.determinant();if(l<Ne*Ne)return t.m[0]=0,t.m[1]=0,t.m[2]=0,t.m[3]=0,t.m[4]=0,t.m[5]=0,this;const h=1/l,f=s*a-o*r,d=i*r-e*a;return t.m[0]=o*h,t.m[1]=-i*h,t.m[2]=-s*h,t.m[3]=e*h,t.m[4]=f*h,t.m[5]=d*h,this}multiplyToRef(t,e){const i=this.m[0],s=this.m[1],o=this.m[2],r=this.m[3],a=this.m[4],l=this.m[5],h=t.m[0],f=t.m[1],d=t.m[2],u=t.m[3],I=t.m[4],k=t.m[5];return e.m[0]=i*h+s*d,e.m[1]=i*f+s*u,e.m[2]=o*h+r*d,e.m[3]=o*f+r*u,e.m[4]=a*h+l*d+I,e.m[5]=a*f+l*u+k,this}transformCoordinates(t,e,i){return i.x=t*this.m[0]+e*this.m[2]+this.m[4],i.y=t*this.m[1]+e*this.m[3]+this.m[5],this}static Identity(){return new w(1,0,0,1,0,0)}static IdentityToRef(t){t.m[0]=1,t.m[1]=0,t.m[2]=0,t.m[3]=1,t.m[4]=0,t.m[5]=0}static TranslationToRef(t,e,i){i.fromValues(1,0,0,1,t,e)}static ScalingToRef(t,e,i){i.fromValues(t,0,0,e,0,0)}static RotationToRef(t,e){const i=Math.sin(t),s=Math.cos(t);e.fromValues(s,i,-i,s,0,0)}static ComposeToRef(t,e,i,s,o,r,a){w.TranslationToRef(t,e,w._TempPreTranslationMatrix),w.ScalingToRef(s,o,w._TempScalingMatrix),w.RotationToRef(i,w._TempRotationMatrix),w.TranslationToRef(-t,-e,w._TempPostTranslationMatrix),w._TempPreTranslationMatrix.multiplyToRef(w._TempScalingMatrix,w._TempCompose0),w._TempCompose0.multiplyToRef(w._TempRotationMatrix,w._TempCompose1),r?(w._TempCompose1.multiplyToRef(w._TempPostTranslationMatrix,w._TempCompose2),w._TempCompose2.multiplyToRef(r,a)):w._TempCompose1.multiplyToRef(w._TempPostTranslationMatrix,a)}}w._TempPreTranslationMatrix=w.Identity();w._TempPostTranslationMatrix=w.Identity();w._TempRotationMatrix=w.Identity();w._TempScalingMatrix=w.Identity();w._TempCompose0=w.Identity();w._TempCompose1=w.Identity();w._TempCompose2=w.Identity();class c{get isReadOnly(){return this._isReadOnly}set isReadOnly(t){this._isReadOnly=t}get transformedMeasure(){return this._evaluatedMeasure}set clipChildren(t){this._clipChildren=t}get clipChildren(){return this._clipChildren}set clipContent(t){this._clipContent=t}get clipContent(){return this._clipContent}get shadowOffsetX(){return this._shadowOffsetX}set shadowOffsetX(t){this._shadowOffsetX!==t&&(this._shadowOffsetX=t,this._markAsDirty())}get shadowOffsetY(){return this._shadowOffsetY}set shadowOffsetY(t){this._shadowOffsetY!==t&&(this._shadowOffsetY=t,this._markAsDirty())}get shadowBlur(){return this._shadowBlur}set shadowBlur(t){this._shadowBlur!==t&&(this._previousShadowBlur=this._shadowBlur,this._shadowBlur=t,this._markAsDirty())}get shadowColor(){return this._shadowColor}set shadowColor(t){this._shadowColor!==t&&(this._shadowColor=t,this._markAsDirty())}get typeName(){return this._getTypeName()}getClassName(){return this._getTypeName()}set accessibilityTag(t){this._accessibilityTag=t,this.onAccessibilityTagChangedObservable.notifyObservers(t)}get accessibilityTag(){return this._accessibilityTag}get host(){return this._host}get fontOffset(){return this._fontOffset}set fontOffset(t){this._fontOffset=t}get alpha(){return this._alpha}set alpha(t){this._alpha!==t&&(this._alphaSet=!0,this._alpha=t,this._markAsDirty())}get highlightLineWidth(){return this._highlightLineWidth}set highlightLineWidth(t){this._highlightLineWidth!==t&&(this._highlightLineWidth=t,this._markAsDirty())}get isHighlighted(){return this._isHighlighted}set isHighlighted(t){this._isHighlighted!==t&&(this._isHighlighted=t,this._markAsDirty())}get highlightColor(){return this._highlightColor}set highlightColor(t){this._highlightColor!==t&&(this._highlightColor=t,this._markAsDirty())}get scaleX(){return this._scaleX}set scaleX(t){this._scaleX!==t&&(this._scaleX=t,this._markAsDirty(),this._markMatrixAsDirty())}get scaleY(){return this._scaleY}set scaleY(t){this._scaleY!==t&&(this._scaleY=t,this._markAsDirty(),this._markMatrixAsDirty())}get rotation(){return this._rotation}set rotation(t){this._rotation!==t&&(this._rotation=t,this._markAsDirty(),this._markMatrixAsDirty())}get transformCenterY(){return this._transformCenterY}set transformCenterY(t){this._transformCenterY!==t&&(this._transformCenterY=t,this._markAsDirty(),this._markMatrixAsDirty())}get transformCenterX(){return this._transformCenterX}set transformCenterX(t){this._transformCenterX!==t&&(this._transformCenterX=t,this._markAsDirty(),this._markMatrixAsDirty())}get horizontalAlignment(){return this._horizontalAlignment}set horizontalAlignment(t){this._horizontalAlignment!==t&&(this._horizontalAlignment=t,this._markAsDirty())}get verticalAlignment(){return this._verticalAlignment}set verticalAlignment(t){this._verticalAlignment!==t&&(this._verticalAlignment=t,this._markAsDirty())}get width(){return this._width.toString(this._host)}set width(t){this._fixedRatioMasterIsWidth=!0,this._width.toString(this._host)!==t&&this._width.fromString(t)&&this._markAsDirty()}get widthInPixels(){return this._width.getValueInPixel(this._host,this._cachedParentMeasure.width)}set widthInPixels(t){isNaN(t)||(this._fixedRatioMasterIsWidth=!0,this.width=t+"px")}get height(){return this._height.toString(this._host)}set height(t){this._fixedRatioMasterIsWidth=!1,this._height.toString(this._host)!==t&&this._height.fromString(t)&&this._markAsDirty()}get heightInPixels(){return this._height.getValueInPixel(this._host,this._cachedParentMeasure.height)}set heightInPixels(t){isNaN(t)||(this._fixedRatioMasterIsWidth=!1,this.height=t+"px")}get fontFamily(){return this._fontFamily}set fontFamily(t){this._fontFamily!==t&&(this._fontFamily=t,this._resetFontCache())}get fontStyle(){return this._fontStyle}set fontStyle(t){this._fontStyle!==t&&(this._fontStyle=t,this._resetFontCache())}get fontWeight(){return this._fontWeight}set fontWeight(t){this._fontWeight!==t&&(this._fontWeight=t,this._resetFontCache())}get style(){return this._style}set style(t){this._style&&(this._style.onChangedObservable.remove(this._styleObserver),this._styleObserver=null),this._style=t,this._style&&(this._styleObserver=this._style.onChangedObservable.add(()=>{this._markAsDirty(),this._resetFontCache()})),this._markAsDirty(),this._resetFontCache()}get _isFontSizeInPercentage(){return this._fontSize.isPercentage}get fontSizeInPixels(){const t=this._style?this._style._fontSize:this._fontSize;return t.isPixel?t.getValue(this._host):t.getValueInPixel(this._host,this._tempParentMeasure.height||this._cachedParentMeasure.height)}set fontSizeInPixels(t){isNaN(t)||(this.fontSize=t+"px")}get fontSize(){return this._fontSize.toString(this._host)}set fontSize(t){this._fontSize.toString(this._host)!==t&&this._fontSize.fromString(t)&&(this._markAsDirty(),this._resetFontCache())}get color(){return this._color}set color(t){this._color!==t&&(this._color=t,this._markAsDirty())}get gradient(){return this._gradient}set gradient(t){this._gradient!==t&&(this._gradient=t,this._markAsDirty())}get zIndex(){return this._zIndex}set zIndex(t){this.zIndex!==t&&(this._zIndex=t,this.parent&&this.parent._reOrderControl(this))}get notRenderable(){return this._doNotRender}set notRenderable(t){this._doNotRender!==t&&(this._doNotRender=t,this._markAsDirty())}get isVisible(){return this._isVisible}set isVisible(t){this._isVisible!==t&&(this._isVisible=t,this._markAsDirty(!0),this.onIsVisibleChangedObservable.notifyObservers(t))}get isDirty(){return this._isDirty}get linkedMesh(){return this._linkedMesh}get descendantsOnlyPadding(){return this._descendantsOnlyPadding}set descendantsOnlyPadding(t){this._descendantsOnlyPadding!==t&&(this._descendantsOnlyPadding=t,this._markAsDirty())}get paddingLeft(){return this._paddingLeft.toString(this._host)}set paddingLeft(t){this._paddingLeft.fromString(t)&&this._markAsDirty()}get paddingLeftInPixels(){return this._paddingLeft.getValueInPixel(this._host,this._cachedParentMeasure.width)}set paddingLeftInPixels(t){isNaN(t)||(this.paddingLeft=t+"px")}get _paddingLeftInPixels(){return this._descendantsOnlyPadding?0:this.paddingLeftInPixels}get paddingRight(){return this._paddingRight.toString(this._host)}set paddingRight(t){this._paddingRight.fromString(t)&&this._markAsDirty()}get paddingRightInPixels(){return this._paddingRight.getValueInPixel(this._host,this._cachedParentMeasure.width)}set paddingRightInPixels(t){isNaN(t)||(this.paddingRight=t+"px")}get _paddingRightInPixels(){return this._descendantsOnlyPadding?0:this.paddingRightInPixels}get paddingTop(){return this._paddingTop.toString(this._host)}set paddingTop(t){this._paddingTop.fromString(t)&&this._markAsDirty()}get paddingTopInPixels(){return this._paddingTop.getValueInPixel(this._host,this._cachedParentMeasure.height)}set paddingTopInPixels(t){isNaN(t)||(this.paddingTop=t+"px")}get _paddingTopInPixels(){return this._descendantsOnlyPadding?0:this.paddingTopInPixels}get paddingBottom(){return this._paddingBottom.toString(this._host)}set paddingBottom(t){this._paddingBottom.fromString(t)&&this._markAsDirty()}get paddingBottomInPixels(){return this._paddingBottom.getValueInPixel(this._host,this._cachedParentMeasure.height)}set paddingBottomInPixels(t){isNaN(t)||(this.paddingBottom=t+"px")}get _paddingBottomInPixels(){return this._descendantsOnlyPadding?0:this.paddingBottomInPixels}get left(){return this._left.toString(this._host)}set left(t){this._left.fromString(t)&&this._markAsDirty()}get leftInPixels(){return this._left.getValueInPixel(this._host,this._cachedParentMeasure.width)}set leftInPixels(t){isNaN(t)||(this.left=t+"px")}get top(){return this._top.toString(this._host)}set top(t){this._top.fromString(t)&&this._markAsDirty()}get topInPixels(){return this._top.getValueInPixel(this._host,this._cachedParentMeasure.height)}set topInPixels(t){isNaN(t)||(this.top=t+"px")}get linkOffsetX(){return this._linkOffsetX.toString(this._host)}set linkOffsetX(t){this._linkOffsetX.fromString(t)&&this._markAsDirty()}get linkOffsetXInPixels(){return this._linkOffsetX.getValueInPixel(this._host,this._cachedParentMeasure.width)}set linkOffsetXInPixels(t){isNaN(t)||(this.linkOffsetX=t+"px")}get linkOffsetY(){return this._linkOffsetY.toString(this._host)}set linkOffsetY(t){this._linkOffsetY.fromString(t)&&this._markAsDirty()}get linkOffsetYInPixels(){return this._linkOffsetY.getValueInPixel(this._host,this._cachedParentMeasure.height)}set linkOffsetYInPixels(t){isNaN(t)||(this.linkOffsetY=t+"px")}get centerX(){return this._currentMeasure.left+this._currentMeasure.width/2}get centerY(){return this._currentMeasure.top+this._currentMeasure.height/2}get isEnabled(){return this._isEnabled}set isEnabled(t){if(this._isEnabled===t)return;this._isEnabled=t,this._markAsDirty();const e=i=>{if(i.host){for(const s in i.host._lastControlOver)i===this.host._lastControlOver[s]&&(i._onPointerOut(i,null,!0),delete i.host._lastControlOver[s]);i.children!==void 0&&i.children.forEach(e)}};e(this)}get disabledColor(){return this._disabledColor}set disabledColor(t){this._disabledColor!==t&&(this._disabledColor=t,this._markAsDirty())}get disabledColorItem(){return this._disabledColorItem}set disabledColorItem(t){this._disabledColorItem!==t&&(this._disabledColorItem=t,this._markAsDirty())}constructor(t){this.name=t,this._alpha=1,this._alphaSet=!1,this._zIndex=0,this._currentMeasure=j.Empty(),this._tempPaddingMeasure=j.Empty(),this._fontFamily="Arial",this._fontStyle="",this._fontWeight="",this._fontSize=new p(18,p.UNITMODE_PIXEL,!1),this._width=new p(1,p.UNITMODE_PERCENTAGE,!1),this._height=new p(1,p.UNITMODE_PERCENTAGE,!1),this._color="",this._style=null,this._horizontalAlignment=c.HORIZONTAL_ALIGNMENT_CENTER,this._verticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,this._isDirty=!0,this._wasDirty=!1,this._tempParentMeasure=j.Empty(),this._prevCurrentMeasureTransformedIntoGlobalSpace=j.Empty(),this._cachedParentMeasure=j.Empty(),this._descendantsOnlyPadding=!1,this._paddingLeft=new p(0),this._paddingRight=new p(0),this._paddingTop=new p(0),this._paddingBottom=new p(0),this._left=new p(0),this._top=new p(0),this._scaleX=1,this._scaleY=1,this._rotation=0,this._transformCenterX=.5,this._transformCenterY=.5,this._transformMatrix=w.Identity(),this._invertTransformMatrix=w.Identity(),this._transformedPosition=W.Zero(),this._isMatrixDirty=!0,this._isVisible=!0,this._isHighlighted=!1,this._highlightColor="#4affff",this._highlightLineWidth=2,this._fontSet=!1,this._dummyVector2=W.Zero(),this._downCount=0,this._enterCount=-1,this._doNotRender=!1,this._downPointerIds={},this._evaluatedMeasure=new j(0,0,0,0),this._evaluatedParentMeasure=new j(0,0,0,0),this._isEnabled=!0,this._disabledColor="#9a9a9a",this._disabledColorItem="#6a6a6a",this._isReadOnly=!1,this._gradient=null,this._rebuildLayout=!1,this._customData={},this._isClipped=!1,this._automaticSize=!1,this.metadata=null,this.isHitTestVisible=!0,this.isPointerBlocker=!1,this.isFocusInvisible=!1,this._clipChildren=!0,this._clipContent=!0,this.useBitmapCache=!1,this._shadowOffsetX=0,this._shadowOffsetY=0,this._shadowBlur=0,this._previousShadowBlur=0,this._shadowColor="black",this.hoverCursor="",this._linkOffsetX=new p(0),this._linkOffsetY=new p(0),this._accessibilityTag=null,this.onAccessibilityTagChangedObservable=new T,this.onWheelObservable=new T,this.onPointerMoveObservable=new T,this.onPointerOutObservable=new T,this.onPointerDownObservable=new T,this.onPointerUpObservable=new T,this.onPointerClickObservable=new T,this.onPointerEnterObservable=new T,this.onDirtyObservable=new T,this.onBeforeDrawObservable=new T,this.onAfterDrawObservable=new T,this.onDisposeObservable=new T,this.onIsVisibleChangedObservable=new T,this.fixedRatio=0,this._fixedRatioMasterIsWidth=!0,this.animations=null,this._tmpMeasureA=new j(0,0,0,0)}_getTypeName(){return"Control"}getAscendantOfClass(t){return this.parent?this.parent.getClassName()===t?this.parent:this.parent.getAscendantOfClass(t):null}markAsDirty(t=!1){this._markAsDirty(t)}markAllAsDirty(){this._markAllAsDirty()}_resetFontCache(){this._fontSet=!0,this._markAsDirty()}isAscendant(t){return this.parent?this.parent===t?!0:this.parent.isAscendant(t):!1}getLocalCoordinates(t){const e=W.Zero();return this.getLocalCoordinatesToRef(t,e),e}getLocalCoordinatesToRef(t,e){return e.x=t.x-this._currentMeasure.left,e.y=t.y-this._currentMeasure.top,this}getParentLocalCoordinates(t){const e=W.Zero();return e.x=t.x-this._cachedParentMeasure.left,e.y=t.y-this._cachedParentMeasure.top,e}moveToVector3(t,e){if(!this._host||this.parent!==this._host._rootContainer){gt.Error("Cannot move a control to a vector3 if the control is not at root level");return}this.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,this.verticalAlignment=c.VERTICAL_ALIGNMENT_TOP;const i=this._host._getGlobalViewport(),s=D.Project(t,si.IdentityReadOnly,e.getTransformMatrix(),i);if(this._moveToProjectedPosition(s),s.z<0||s.z>1){this.notRenderable=!0;return}this.notRenderable=!1}getDescendantsToRef(t,e=!1,i){}getDescendants(t,e){const i=new Array;return this.getDescendantsToRef(i,t,e),i}linkWithMesh(t){if(!this._host||this.parent&&this.parent!==this._host._rootContainer){t&&gt.Error("Cannot link a control to a mesh if the control is not at root level");return}const e=this._host._linkedControls.indexOf(this);if(e!==-1){this._linkedMesh=t,t||this._host._linkedControls.splice(e,1);return}else if(!t)return;this.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,this.verticalAlignment=c.VERTICAL_ALIGNMENT_TOP,this._linkedMesh=t,this._host._linkedControls.push(this)}setPadding(t,e,i,s){const o=t,r=e??o,a=i??o,l=s??r;this.paddingTop=o,this.paddingRight=r,this.paddingBottom=a,this.paddingLeft=l}setPaddingInPixels(t,e,i,s){const o=t,r=e??o,a=i??o,l=s??r;this.paddingTopInPixels=o,this.paddingRightInPixels=r,this.paddingBottomInPixels=a,this.paddingLeftInPixels=l}_moveToProjectedPosition(t){var e;const i=this._left.getValue(this._host),s=this._top.getValue(this._host),o=(e=this.parent)===null||e===void 0?void 0:e._currentMeasure;o&&this._processMeasures(o,this._host.getContext());let r=t.x+this._linkOffsetX.getValue(this._host)-this._currentMeasure.width/2,a=t.y+this._linkOffsetY.getValue(this._host)-this._currentMeasure.height/2;const l=this._left.ignoreAdaptiveScaling&&this._top.ignoreAdaptiveScaling;l&&(Math.abs(r-i)<.5&&(r=i),Math.abs(a-s)<.5&&(a=s)),!(!l&&i===r&&s===a)&&(this.left=r+"px",this.top=a+"px",this._left.ignoreAdaptiveScaling=!0,this._top.ignoreAdaptiveScaling=!0,this._markAsDirty())}_offsetLeft(t){this._isDirty=!0,this._currentMeasure.left+=t}_offsetTop(t){this._isDirty=!0,this._currentMeasure.top+=t}_markMatrixAsDirty(){this._isMatrixDirty=!0,this._flagDescendantsAsMatrixDirty()}_flagDescendantsAsMatrixDirty(){}_intersectsRect(t,e){return this._transform(e),!(this._evaluatedMeasure.left>=t.left+t.width||this._evaluatedMeasure.top>=t.top+t.height||this._evaluatedMeasure.left+this._evaluatedMeasure.width<=t.left||this._evaluatedMeasure.top+this._evaluatedMeasure.height<=t.top)}_computeAdditionnalOffsetX(){return 0}_computeAdditionnalOffsetY(){return 0}invalidateRect(){if(this._transform(),this.host&&this.host.useInvalidateRectOptimization){this._currentMeasure.transformToRef(this._transformMatrix,this._tmpMeasureA),j.CombineToRef(this._tmpMeasureA,this._prevCurrentMeasureTransformedIntoGlobalSpace,this._tmpMeasureA);const t=this.shadowOffsetX,e=this.shadowOffsetY,i=Math.max(this._previousShadowBlur,this.shadowBlur),s=Math.min(Math.min(t,0)-i*2,0),o=Math.max(Math.max(t,0)+i*2,0),r=Math.min(Math.min(e,0)-i*2,0),a=Math.max(Math.max(e,0)+i*2,0),l=this._computeAdditionnalOffsetX(),h=this._computeAdditionnalOffsetY();this.host.invalidateRect(Math.floor(this._tmpMeasureA.left+s-l),Math.floor(this._tmpMeasureA.top+r-h),Math.ceil(this._tmpMeasureA.left+this._tmpMeasureA.width+o+l),Math.ceil(this._tmpMeasureA.top+this._tmpMeasureA.height+a+h))}}_markAsDirty(t=!1){!this._isVisible&&!t||(this._isDirty=!0,this._markMatrixAsDirty(),this._host&&this._host.markAsDirty())}_markAllAsDirty(){this._markAsDirty(),this._font&&this._prepareFont()}_link(t){this._host=t,this._host&&(this.uniqueId=this._host.getScene().getUniqueId())}_transform(t){if(!this._isMatrixDirty&&this._scaleX===1&&this._scaleY===1&&this._rotation===0)return;const e=this._currentMeasure.width*this._transformCenterX+this._currentMeasure.left,i=this._currentMeasure.height*this._transformCenterY+this._currentMeasure.top;t&&(t.translate(e,i),t.rotate(this._rotation),t.scale(this._scaleX,this._scaleY),t.translate(-e,-i)),(this._isMatrixDirty||this._cachedOffsetX!==e||this._cachedOffsetY!==i)&&(this._cachedOffsetX=e,this._cachedOffsetY=i,this._isMatrixDirty=!1,this._flagDescendantsAsMatrixDirty(),w.ComposeToRef(-e,-i,this._rotation,this._scaleX,this._scaleY,this.parent?this.parent._transformMatrix:null,this._transformMatrix),this._transformMatrix.invertToRef(this._invertTransformMatrix),this._currentMeasure.transformToRef(this._transformMatrix,this._evaluatedMeasure))}_renderHighlight(t){this.isHighlighted&&(t.save(),t.strokeStyle=this._highlightColor,t.lineWidth=this._highlightLineWidth,this._renderHighlightSpecific(t),t.restore())}_renderHighlightSpecific(t){t.strokeRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height)}_getColor(t){return this.gradient?this.gradient.getCanvasGradient(t):this.color}_applyStates(t){this._isFontSizeInPercentage&&(this._fontSet=!0),this._host&&this._host.useSmallestIdeal&&!this._font&&(this._fontSet=!0),this._fontSet&&(this._prepareFont(),this._fontSet=!1),this._font&&(t.font=this._font),(this._color||this.gradient)&&(t.fillStyle=this._getColor(t)),c.AllowAlphaInheritance?t.globalAlpha*=this._alpha:this._alphaSet&&(t.globalAlpha=this.parent&&!this.parent.renderToIntermediateTexture?this.parent.alpha*this._alpha:this._alpha)}_layout(t,e){if(!this.isDirty&&(!this.isVisible||this.notRenderable))return!1;if(this._isDirty||!this._cachedParentMeasure.isEqualsTo(t)){this.host._numLayoutCalls++,this._currentMeasure.addAndTransformToRef(this._transformMatrix,-this._paddingLeftInPixels|0,-this._paddingTopInPixels|0,this._paddingRightInPixels|0,this._paddingBottomInPixels|0,this._prevCurrentMeasureTransformedIntoGlobalSpace),e.save(),this._applyStates(e);let i=0;do this._rebuildLayout=!1,this._processMeasures(t,e),i++;while(this._rebuildLayout&&i<3);i>=3&&oi.Error(`Layout cycle detected in GUI (Control name=${this.name}, uniqueId=${this.uniqueId})`),e.restore(),this.invalidateRect(),this._evaluateClippingState(t)}return this._wasDirty=this._isDirty,this._isDirty=!1,!0}_processMeasures(t,e){this._tempPaddingMeasure.copyFrom(t),this.parent&&this.parent.descendantsOnlyPadding&&(this._tempPaddingMeasure.left+=this.parent.paddingLeftInPixels,this._tempPaddingMeasure.top+=this.parent.paddingTopInPixels,this._tempPaddingMeasure.width-=this.parent.paddingLeftInPixels+this.parent.paddingRightInPixels,this._tempPaddingMeasure.height-=this.parent.paddingTopInPixels+this.parent.paddingBottomInPixels),this._currentMeasure.copyFrom(this._tempPaddingMeasure),this._preMeasure(this._tempPaddingMeasure,e),this._measure(),this._computeAlignment(this._tempPaddingMeasure,e),this._currentMeasure.left=this._currentMeasure.left|0,this._currentMeasure.top=this._currentMeasure.top|0,this._currentMeasure.width=this._currentMeasure.width|0,this._currentMeasure.height=this._currentMeasure.height|0,this._additionalProcessing(this._tempPaddingMeasure,e),this._cachedParentMeasure.copyFrom(this._tempPaddingMeasure),this._currentMeasure.transformToRef(this._transformMatrix,this._evaluatedMeasure),this.onDirtyObservable.hasObservers()&&this.onDirtyObservable.notifyObservers(this)}_evaluateClippingState(t){if(this._transform(),this._currentMeasure.transformToRef(this._transformMatrix,this._evaluatedMeasure),this.parent&&this.parent.clipChildren){if(t.transformToRef(this.parent._transformMatrix,this._evaluatedParentMeasure),this._evaluatedMeasure.left>this._evaluatedParentMeasure.left+this._evaluatedParentMeasure.width){this._isClipped=!0;return}if(this._evaluatedMeasure.left+this._evaluatedMeasure.width<this._evaluatedParentMeasure.left){this._isClipped=!0;return}if(this._evaluatedMeasure.top>this._evaluatedParentMeasure.top+this._evaluatedParentMeasure.height){this._isClipped=!0;return}if(this._evaluatedMeasure.top+this._evaluatedMeasure.height<this._evaluatedParentMeasure.top){this._isClipped=!0;return}}this._isClipped=!1}_measure(){this._width.isPixel?this._currentMeasure.width=this._width.getValue(this._host):this._currentMeasure.width*=this._width.getValue(this._host),this._height.isPixel?this._currentMeasure.height=this._height.getValue(this._host):this._currentMeasure.height*=this._height.getValue(this._host),this.fixedRatio!==0&&(this._fixedRatioMasterIsWidth?this._currentMeasure.height=this._currentMeasure.width*this.fixedRatio:this._currentMeasure.width=this._currentMeasure.height*this.fixedRatio)}_computeAlignment(t,e){const i=this._currentMeasure.width,s=this._currentMeasure.height,o=t.width,r=t.height;let a=0,l=0;switch(this.horizontalAlignment){case c.HORIZONTAL_ALIGNMENT_LEFT:a=0;break;case c.HORIZONTAL_ALIGNMENT_RIGHT:a=o-i;break;case c.HORIZONTAL_ALIGNMENT_CENTER:a=(o-i)/2;break}switch(this.verticalAlignment){case c.VERTICAL_ALIGNMENT_TOP:l=0;break;case c.VERTICAL_ALIGNMENT_BOTTOM:l=r-s;break;case c.VERTICAL_ALIGNMENT_CENTER:l=(r-s)/2;break}this.descendantsOnlyPadding||(this._paddingLeft.isPixel?(this._currentMeasure.left+=this._paddingLeft.getValue(this._host),this._currentMeasure.width-=this._paddingLeft.getValue(this._host)):(this._currentMeasure.left+=o*this._paddingLeft.getValue(this._host),this._currentMeasure.width-=o*this._paddingLeft.getValue(this._host)),this._paddingRight.isPixel?this._currentMeasure.width-=this._paddingRight.getValue(this._host):this._currentMeasure.width-=o*this._paddingRight.getValue(this._host),this._paddingTop.isPixel?(this._currentMeasure.top+=this._paddingTop.getValue(this._host),this._currentMeasure.height-=this._paddingTop.getValue(this._host)):(this._currentMeasure.top+=r*this._paddingTop.getValue(this._host),this._currentMeasure.height-=r*this._paddingTop.getValue(this._host)),this._paddingBottom.isPixel?this._currentMeasure.height-=this._paddingBottom.getValue(this._host):this._currentMeasure.height-=r*this._paddingBottom.getValue(this._host)),this._left.isPixel?this._currentMeasure.left+=this._left.getValue(this._host):this._currentMeasure.left+=o*this._left.getValue(this._host),this._top.isPixel?this._currentMeasure.top+=this._top.getValue(this._host):this._currentMeasure.top+=r*this._top.getValue(this._host),this._currentMeasure.left+=a,this._currentMeasure.top+=l}_preMeasure(t,e){}_additionalProcessing(t,e){}_clipForChildren(t){}_clip(t,e){if(t.beginPath(),c._ClipMeasure.copyFrom(this._currentMeasure),e){e.transformToRef(this._invertTransformMatrix,this._tmpMeasureA);const i=new j(0,0,0,0);i.left=Math.max(this._tmpMeasureA.left,this._currentMeasure.left),i.top=Math.max(this._tmpMeasureA.top,this._currentMeasure.top),i.width=Math.min(this._tmpMeasureA.left+this._tmpMeasureA.width,this._currentMeasure.left+this._currentMeasure.width)-i.left,i.height=Math.min(this._tmpMeasureA.top+this._tmpMeasureA.height,this._currentMeasure.top+this._currentMeasure.height)-i.top,c._ClipMeasure.copyFrom(i)}if(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY){const i=this.shadowOffsetX,s=this.shadowOffsetY,o=this.shadowBlur,r=Math.min(Math.min(i,0)-o*2,0),a=Math.max(Math.max(i,0)+o*2,0),l=Math.min(Math.min(s,0)-o*2,0),h=Math.max(Math.max(s,0)+o*2,0);t.rect(c._ClipMeasure.left+r,c._ClipMeasure.top+l,c._ClipMeasure.width+a-r,c._ClipMeasure.height+h-l)}else t.rect(c._ClipMeasure.left,c._ClipMeasure.top,c._ClipMeasure.width,c._ClipMeasure.height);t.clip()}_render(t,e){return!this.isVisible||this.notRenderable||this._isClipped?(this._isDirty=!1,!1):(this.host._numRenderCalls++,t.save(),this._applyStates(t),this._transform(t),this.clipContent&&this._clip(t,e),this.onBeforeDrawObservable.hasObservers()&&this.onBeforeDrawObservable.notifyObservers(this),this.useBitmapCache&&!this._wasDirty&&this._cacheData?t.putImageData(this._cacheData,this._currentMeasure.left,this._currentMeasure.top):this._draw(t,e),this.useBitmapCache&&this._wasDirty&&(this._cacheData=t.getImageData(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height)),this._renderHighlight(t),this.onAfterDrawObservable.hasObservers()&&this.onAfterDrawObservable.notifyObservers(this),t.restore(),!0)}_draw(t,e){}contains(t,e){return this._invertTransformMatrix.transformCoordinates(t,e,this._transformedPosition),t=this._transformedPosition.x,e=this._transformedPosition.y,t<this._currentMeasure.left||t>this._currentMeasure.left+this._currentMeasure.width||e<this._currentMeasure.top||e>this._currentMeasure.top+this._currentMeasure.height?!1:(this.isPointerBlocker&&(this._host._shouldBlockPointer=!0),!0)}_processPicking(t,e,i,s,o,r,a,l){return!this._isEnabled||!this.isHitTestVisible||!this.isVisible||this._doNotRender||!this.contains(t,e)?!1:(this._processObservables(s,t,e,i,o,r,a,l),!0)}_onPointerMove(t,e,i,s){this.onPointerMoveObservable.notifyObservers(e,-1,t,this,s)&&this.parent!=null&&!this.isPointerBlocker&&this.parent._onPointerMove(t,e,i,s)}_onPointerEnter(t,e){return!this._isEnabled||this._enterCount>0?!1:(this._enterCount===-1&&(this._enterCount=0),this._enterCount++,this.onPointerEnterObservable.notifyObservers(this,-1,t,this,e)&&this.parent!=null&&!this.isPointerBlocker&&this.parent._onPointerEnter(t,e),!0)}_onPointerOut(t,e,i=!1){if(!i&&(!this._isEnabled||t===this))return;this._enterCount=0;let s=!0;t.isAscendant(this)||(s=this.onPointerOutObservable.notifyObservers(this,-1,t,this,e)),s&&this.parent!=null&&!this.isPointerBlocker&&this.parent._onPointerOut(t,e,i)}_onPointerDown(t,e,i,s,o){return this._onPointerEnter(this,o),this._downCount!==0?!1:(this._downCount++,this._downPointerIds[i]=!0,this.onPointerDownObservable.notifyObservers(new Xe(e,s),-1,t,this,o)&&this.parent!=null&&!this.isPointerBlocker&&this.parent._onPointerDown(t,e,i,s,o),o&&this.uniqueId!==this._host.rootContainer.uniqueId&&this._host._capturedPointerIds.add(o.event.pointerId),!0)}_onPointerUp(t,e,i,s,o,r){if(!this._isEnabled)return;this._downCount=0,delete this._downPointerIds[i];let a=o;o&&(this._enterCount>0||this._enterCount===-1)&&(a=this.onPointerClickObservable.notifyObservers(new Xe(e,s),-1,t,this,r)),this.onPointerUpObservable.notifyObservers(new Xe(e,s),-1,t,this,r)&&this.parent!=null&&!this.isPointerBlocker&&this.parent._onPointerUp(t,e,i,s,a,r),r&&this.uniqueId!==this._host.rootContainer.uniqueId&&this._host._capturedPointerIds.delete(r.event.pointerId)}_forcePointerUp(t=null){if(t!==null)this._onPointerUp(this,W.Zero(),t,0,!0);else for(const e in this._downPointerIds)this._onPointerUp(this,W.Zero(),+e,0,!0)}_onWheelScroll(t,e){if(!this._isEnabled)return;this.onWheelObservable.notifyObservers(new W(t,e))&&this.parent!=null&&this.parent._onWheelScroll(t,e)}_onCanvasBlur(){}_processObservables(t,e,i,s,o,r,a,l){if(!this._isEnabled)return!1;if(this._dummyVector2.copyFromFloats(e,i),t===et.POINTERMOVE){this._onPointerMove(this,this._dummyVector2,o,s);const h=this._host._lastControlOver[o];return h&&h!==this&&h._onPointerOut(this,s),h!==this&&this._onPointerEnter(this,s),this._host._lastControlOver[o]=this,!0}return t===et.POINTERDOWN?(this._onPointerDown(this,this._dummyVector2,o,r,s),this._host._registerLastControlDown(this,o),this._host._lastPickedControl=this,!0):t===et.POINTERUP?(this._host._lastControlDown[o]&&this._host._lastControlDown[o]._onPointerUp(this,this._dummyVector2,o,r,!0,s),delete this._host._lastControlDown[o],!0):t===et.POINTERWHEEL&&this._host._lastControlOver[o]?(this._host._lastControlOver[o]._onWheelScroll(a,l),!0):!1}_prepareFont(){!this._font&&!this._fontSet||(this._style?this._font=this._style.fontStyle+" "+this._style.fontWeight+" "+this.fontSizeInPixels+"px "+this._style.fontFamily:this._font=this._fontStyle+" "+this._fontWeight+" "+this.fontSizeInPixels+"px "+this._fontFamily,this._fontOffset=c._GetFontOffset(this._font),this.getDescendants().forEach(t=>t._markAllAsDirty()))}clone(t){const e={};this.serialize(e);const i=gt.Instantiate("BABYLON.GUI."+e.className),s=new i;return s.parse(e,t),s}parse(t,e){return H.Parse(()=>this,t,null),this.name=t.name,this._parseFromContent(t,e??this._host),this}serialize(t){H.Serialize(this,t),t.name=this.name,t.className=this.getClassName(),this._font&&(t.fontFamily=this._fontFamily,t.fontSize=this.fontSize,t.fontWeight=this.fontWeight,t.fontStyle=this.fontStyle),this._gradient&&(t.gradient={},this._gradient.serialize(t.gradient)),H.AppendSerializedAnimations(this,t)}_parseFromContent(t,e){var i;if(t.fontFamily&&(this.fontFamily=t.fontFamily),t.fontSize&&(this.fontSize=t.fontSize),t.fontWeight&&(this.fontWeight=t.fontWeight),t.fontStyle&&(this.fontStyle=t.fontStyle),t.gradient){const s=gt.Instantiate("BABYLON.GUI."+t.gradient.className);this._gradient=new s,(i=this._gradient)===null||i===void 0||i.parse(t.gradient)}if(t.animations){this.animations=[];for(let s=0;s<t.animations.length;s++){const o=t.animations[s],r=ri("BABYLON.Animation");r&&this.animations.push(r.Parse(o))}t.autoAnimate&&this._host&&this._host.getScene()&&this._host.getScene().beginAnimation(this,t.autoAnimateFrom,t.autoAnimateTo,t.autoAnimateLoop,t.autoAnimateSpeed||1)}}dispose(){this.onDirtyObservable.clear(),this.onBeforeDrawObservable.clear(),this.onAfterDrawObservable.clear(),this.onPointerDownObservable.clear(),this.onPointerEnterObservable.clear(),this.onPointerMoveObservable.clear(),this.onPointerOutObservable.clear(),this.onPointerUpObservable.clear(),this.onPointerClickObservable.clear(),this.onWheelObservable.clear(),this._styleObserver&&this._style&&(this._style.onChangedObservable.remove(this._styleObserver),this._styleObserver=null),this.parent&&(this.parent.removeControl(this),this.parent=null),this._host&&this._host._linkedControls.indexOf(this)>-1&&this.linkWithMesh(null),this.onDisposeObservable.notifyObservers(this),this.onDisposeObservable.clear()}static get HORIZONTAL_ALIGNMENT_LEFT(){return c._HORIZONTAL_ALIGNMENT_LEFT}static get HORIZONTAL_ALIGNMENT_RIGHT(){return c._HORIZONTAL_ALIGNMENT_RIGHT}static get HORIZONTAL_ALIGNMENT_CENTER(){return c._HORIZONTAL_ALIGNMENT_CENTER}static get VERTICAL_ALIGNMENT_TOP(){return c._VERTICAL_ALIGNMENT_TOP}static get VERTICAL_ALIGNMENT_BOTTOM(){return c._VERTICAL_ALIGNMENT_BOTTOM}static get VERTICAL_ALIGNMENT_CENTER(){return c._VERTICAL_ALIGNMENT_CENTER}static _GetFontOffset(t){if(c._FontHeightSizes[t])return c._FontHeightSizes[t];const e=ne.LastCreatedEngine;if(!e)throw new Error("Invalid engine. Unable to create a canvas.");const i=e.getFontOffset(t);return c._FontHeightSizes[t]=i,i}static Parse(t,e){const i=gt.Instantiate("BABYLON.GUI."+t.className),s=H.Parse(()=>new i,t,null);return s.name=t.name,s._parseFromContent(t,e),s}static drawEllipse(t,e,i,s,o){o.translate(t,e),o.scale(i,s),o.beginPath(),o.arc(0,0,1,0,2*Math.PI),o.closePath(),o.scale(1/i,1/s),o.translate(-t,-e)}isReady(){return!0}}c.AllowAlphaInheritance=!1;c._ClipMeasure=new j(0,0,0,0);c._HORIZONTAL_ALIGNMENT_LEFT=0;c._HORIZONTAL_ALIGNMENT_RIGHT=1;c._HORIZONTAL_ALIGNMENT_CENTER=2;c._VERTICAL_ALIGNMENT_TOP=0;c._VERTICAL_ALIGNMENT_BOTTOM=1;c._VERTICAL_ALIGNMENT_CENTER=2;c._FontHeightSizes={};c.AddHeader=()=>{};n([_()],c.prototype,"metadata",void 0);n([_()],c.prototype,"isHitTestVisible",void 0);n([_()],c.prototype,"isPointerBlocker",void 0);n([_()],c.prototype,"isFocusInvisible",void 0);n([_()],c.prototype,"clipChildren",null);n([_()],c.prototype,"clipContent",null);n([_()],c.prototype,"useBitmapCache",void 0);n([_()],c.prototype,"shadowOffsetX",null);n([_()],c.prototype,"shadowOffsetY",null);n([_()],c.prototype,"shadowBlur",null);n([_()],c.prototype,"shadowColor",null);n([_()],c.prototype,"hoverCursor",void 0);n([_()],c.prototype,"fontOffset",null);n([_()],c.prototype,"alpha",null);n([_()],c.prototype,"scaleX",null);n([_()],c.prototype,"scaleY",null);n([_()],c.prototype,"rotation",null);n([_()],c.prototype,"transformCenterY",null);n([_()],c.prototype,"transformCenterX",null);n([_()],c.prototype,"horizontalAlignment",null);n([_()],c.prototype,"verticalAlignment",null);n([_()],c.prototype,"fixedRatio",void 0);n([_()],c.prototype,"width",null);n([_()],c.prototype,"height",null);n([_()],c.prototype,"style",null);n([_()],c.prototype,"color",null);n([_()],c.prototype,"gradient",null);n([_()],c.prototype,"zIndex",null);n([_()],c.prototype,"notRenderable",null);n([_()],c.prototype,"isVisible",null);n([_()],c.prototype,"descendantsOnlyPadding",null);n([_()],c.prototype,"paddingLeft",null);n([_()],c.prototype,"paddingRight",null);n([_()],c.prototype,"paddingTop",null);n([_()],c.prototype,"paddingBottom",null);n([_()],c.prototype,"left",null);n([_()],c.prototype,"top",null);n([_()],c.prototype,"linkOffsetX",null);n([_()],c.prototype,"linkOffsetY",null);n([_()],c.prototype,"isEnabled",null);n([_()],c.prototype,"disabledColor",null);n([_()],c.prototype,"disabledColorItem",null);n([_()],c.prototype,"overlapGroup",void 0);n([_()],c.prototype,"overlapDeltaMultiplier",void 0);F("BABYLON.GUI.Control",c);class ht extends c{get renderToIntermediateTexture(){return this._renderToIntermediateTexture}set renderToIntermediateTexture(t){this._renderToIntermediateTexture!==t&&(this._renderToIntermediateTexture=t,this._markAsDirty())}get adaptHeightToChildren(){return this._adaptHeightToChildren}set adaptHeightToChildren(t){this._adaptHeightToChildren!==t&&(this._adaptHeightToChildren=t,t&&(this.height="100%"),this._markAsDirty())}get adaptWidthToChildren(){return this._adaptWidthToChildren}set adaptWidthToChildren(t){this._adaptWidthToChildren!==t&&(this._adaptWidthToChildren=t,t&&(this.width="100%"),this._markAsDirty())}get background(){return this._background}set background(t){this._background!==t&&(this._background=t,this._markAsDirty())}get backgroundGradient(){return this._backgroundGradient}set backgroundGradient(t){this._backgroundGradient!==t&&(this._backgroundGradient=t,this._markAsDirty())}get children(){return this._children}get isReadOnly(){return this._isReadOnly}set isReadOnly(t){this._isReadOnly=t;for(const e of this._children)e.isReadOnly=t}constructor(t){super(t),this.name=t,this._children=new Array,this._measureForChildren=j.Empty(),this._background="",this._backgroundGradient=null,this._adaptWidthToChildren=!1,this._adaptHeightToChildren=!1,this._renderToIntermediateTexture=!1,this._intermediateTexture=null,this.logLayoutCycleErrors=!1,this.maxLayoutCycle=3,this.onControlAddedObservable=new T,this.onControlRemovedObservable=new T,this._inverseTransformMatrix=w.Identity(),this._inverseMeasure=new j(0,0,0,0)}_getTypeName(){return"Container"}_flagDescendantsAsMatrixDirty(){for(const t of this.children)t._isClipped=!1,t._markMatrixAsDirty()}getChildByName(t){for(const e of this.children)if(e.name===t)return e;return null}getChildByType(t,e){for(const i of this.children)if(i.typeName===e)return i;return null}containsControl(t){return this.children.indexOf(t)!==-1}addControl(t){return t?this._children.indexOf(t)!==-1?this:(t._link(this._host),t._markAllAsDirty(),this._reOrderControl(t),this._markAsDirty(),this.onControlAddedObservable.notifyObservers(t),this):this}clearControls(){const t=this.children.slice();for(const e of t)this.removeControl(e);return this}removeControl(t){const e=this._children.indexOf(t);return e!==-1&&(this._children.splice(e,1),t.parent=null),t.linkWithMesh(null),this._host&&this._host._cleanControlAfterRemoval(t),this._markAsDirty(),this.onControlRemovedObservable.notifyObservers(t),this}_reOrderControl(t){const e=t.linkedMesh;this.removeControl(t);let i=!1;for(let s=0;s<this._children.length;s++)if(this._children[s].zIndex>t.zIndex){this._children.splice(s,0,t),i=!0;break}i||this._children.push(t),t.parent=this,e&&t.linkWithMesh(e),this._markAsDirty()}_offsetLeft(t){super._offsetLeft(t);for(const e of this._children)e._offsetLeft(t)}_offsetTop(t){super._offsetTop(t);for(const e of this._children)e._offsetTop(t)}_markAllAsDirty(){super._markAllAsDirty();for(let t=0;t<this._children.length;t++)this._children[t]._markAllAsDirty()}_getBackgroundColor(t){return this._backgroundGradient?this._backgroundGradient.getCanvasGradient(t):this._background}_localDraw(t){(this._background||this._backgroundGradient)&&(t.save(),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),t.fillStyle=this._getBackgroundColor(t),t.fillRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height),t.restore())}_link(t){super._link(t);for(const e of this._children)e._link(t)}_beforeLayout(){}_processMeasures(t,e){(this._isDirty||!this._cachedParentMeasure.isEqualsTo(t))&&(super._processMeasures(t,e),this._evaluateClippingState(t),this._renderToIntermediateTexture&&(this._intermediateTexture&&this._host.getScene()!=this._intermediateTexture.getScene()&&(this._intermediateTexture.dispose(),this._intermediateTexture=null),this._intermediateTexture?this._intermediateTexture.scaleTo(this._currentMeasure.width,this._currentMeasure.height):(this._intermediateTexture=new ni("",{width:this._currentMeasure.width,height:this._currentMeasure.height},this._host.getScene(),!1,O.NEAREST_SAMPLINGMODE,Rt.TEXTUREFORMAT_RGBA,!1),this._intermediateTexture.hasAlpha=!0)))}_layout(t,e){var i,s;if(!this.isDirty&&(!this.isVisible||this.notRenderable))return!1;this.host._numLayoutCalls++,this._isDirty&&this._currentMeasure.transformToRef(this._transformMatrix,this._prevCurrentMeasureTransformedIntoGlobalSpace);let o=0;e.save(),this._applyStates(e),this._beforeLayout();do{let r=-1,a=-1;if(this._rebuildLayout=!1,this._processMeasures(t,e),!this._isClipped){for(const l of this._children)l._tempParentMeasure.copyFrom(this._measureForChildren),l._layout(this._measureForChildren,e)&&l.isVisible&&!l.notRenderable&&(this.adaptWidthToChildren&&l._width.isPixel&&(r=Math.max(r,l._currentMeasure.width+l._paddingLeftInPixels+l._paddingRightInPixels)),this.adaptHeightToChildren&&l._height.isPixel&&(a=Math.max(a,l._currentMeasure.height+l._paddingTopInPixels+l._paddingBottomInPixels)));this.adaptWidthToChildren&&r>=0&&(r+=this.paddingLeftInPixels+this.paddingRightInPixels,this.width!==r+"px"&&((i=this.parent)===null||i===void 0||i._markAsDirty(),this.width=r+"px",this._width.ignoreAdaptiveScaling=!0,this._rebuildLayout=!0)),this.adaptHeightToChildren&&a>=0&&(a+=this.paddingTopInPixels+this.paddingBottomInPixels,this.height!==a+"px"&&((s=this.parent)===null||s===void 0||s._markAsDirty(),this.height=a+"px",this._height.ignoreAdaptiveScaling=!0,this._rebuildLayout=!0)),this._postMeasure()}o++}while(this._rebuildLayout&&o<this.maxLayoutCycle);return o>=3&&this.logLayoutCycleErrors&&oi.Error(`Layout cycle detected in GUI (Container name=${this.name}, uniqueId=${this.uniqueId})`),e.restore(),this._isDirty&&(this.invalidateRect(),this._isDirty=!1),!0}_postMeasure(){}_draw(t,e){const i=this._renderToIntermediateTexture&&this._intermediateTexture,s=i?this._intermediateTexture.getContext():t;i&&(s.save(),s.translate(-this._currentMeasure.left,-this._currentMeasure.top),e?(this._transformMatrix.invertToRef(this._inverseTransformMatrix),e.transformToRef(this._inverseTransformMatrix,this._inverseMeasure),s.clearRect(this._inverseMeasure.left,this._inverseMeasure.top,this._inverseMeasure.width,this._inverseMeasure.height)):s.clearRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height)),this._localDraw(s),t.save(),this.clipChildren&&this._clipForChildren(s);for(const o of this._children)e&&!o._intersectsRect(e)||o._render(s,e);i&&(s.restore(),t.save(),t.globalAlpha=this.alpha,t.drawImage(s.canvas,this._currentMeasure.left,this._currentMeasure.top),t.restore()),t.restore()}getDescendantsToRef(t,e=!1,i){if(this.children)for(let s=0;s<this.children.length;s++){const o=this.children[s];(!i||i(o))&&t.push(o),e||o.getDescendantsToRef(t,!1,i)}}_processPicking(t,e,i,s,o,r,a,l){if(!this._isEnabled||!this.isVisible||this.notRenderable)return!1;const h=super.contains(t,e);if(!h&&this.clipChildren)return!1;for(let f=this._children.length-1;f>=0;f--){const d=this._children[f];if(d._processPicking(t,e,i,s,o,r,a,l))return d.hoverCursor&&this._host._changeCursor(d.hoverCursor),!0}return!h||!this.isHitTestVisible?!1:this._processObservables(s,t,e,i,o,r,a,l)}_additionalProcessing(t,e){super._additionalProcessing(t,e),this._measureForChildren.copyFrom(this._currentMeasure)}serialize(t){if(super.serialize(t),this.backgroundGradient&&(t.backgroundGradient={},this.backgroundGradient.serialize(t.backgroundGradient)),!!this.children.length){t.children=[];for(const e of this.children){const i={};e.serialize(i),t.children.push(i)}}}dispose(){var t;super.dispose();for(let e=this.children.length-1;e>=0;e--)this.children[e].dispose();(t=this._intermediateTexture)===null||t===void 0||t.dispose()}_parseFromContent(t,e){var i;if(super._parseFromContent(t,e),this._link(e),t.backgroundGradient){const s=gt.Instantiate("BABYLON.GUI."+t.backgroundGradient.className);this._backgroundGradient=new s,(i=this._backgroundGradient)===null||i===void 0||i.parse(t.backgroundGradient)}if(t.children)for(const s of t.children)this.addControl(c.Parse(s,e))}isReady(){for(const t of this.children)if(!t.isReady())return!1;return!0}}n([_()],ht.prototype,"renderToIntermediateTexture",null);n([_()],ht.prototype,"maxLayoutCycle",void 0);n([_()],ht.prototype,"adaptHeightToChildren",null);n([_()],ht.prototype,"adaptWidthToChildren",null);n([_()],ht.prototype,"background",null);n([_()],ht.prototype,"backgroundGradient",null);F("BABYLON.GUI.Container",ht);class Bt extends ht{get thickness(){return this._thickness}set thickness(t){this._thickness!==t&&(this._thickness=t,this._markAsDirty())}get cornerRadius(){return this._cornerRadius}set cornerRadius(t){t<0&&(t=0),this._cornerRadius!==t&&(this._cornerRadius=t,this._markAsDirty())}constructor(t){super(t),this.name=t,this._thickness=1,this._cornerRadius=0}_getTypeName(){return"Rectangle"}_computeAdditionnalOffsetX(){return this._cornerRadius?1:0}_computeAdditionnalOffsetY(){return this._cornerRadius?1:0}_getRectangleFill(t){return this._getBackgroundColor(t)}_localDraw(t){t.save(),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),(this._background||this._backgroundGradient)&&(t.fillStyle=this._getRectangleFill(t),this._cornerRadius?(this._drawRoundedRect(t,this._thickness/2),t.fill()):t.fillRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height)),this._thickness&&((this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),(this.color||this.gradient)&&(t.strokeStyle=this.gradient?this.gradient.getCanvasGradient(t):this.color),t.lineWidth=this._thickness,this._cornerRadius?(this._drawRoundedRect(t,this._thickness/2),t.stroke()):t.strokeRect(this._currentMeasure.left+this._thickness/2,this._currentMeasure.top+this._thickness/2,this._currentMeasure.width-this._thickness,this._currentMeasure.height-this._thickness)),t.restore()}_additionalProcessing(t,e){super._additionalProcessing(t,e),this._measureForChildren.width-=2*this._thickness,this._measureForChildren.height-=2*this._thickness,this._measureForChildren.left+=this._thickness,this._measureForChildren.top+=this._thickness}_drawRoundedRect(t,e=0){const i=this._currentMeasure.left+e,s=this._currentMeasure.top+e,o=this._currentMeasure.width-e*2,r=this._currentMeasure.height-e*2;let a=Math.min(r/2,Math.min(o/2,this._cornerRadius));a=Math.abs(a),t.beginPath(),t.moveTo(i+a,s),t.lineTo(i+o-a,s),t.arc(i+o-a,s+a,a,3*Math.PI/2,Math.PI*2),t.lineTo(i+o,s+r-a),t.arc(i+o-a,s+r-a,a,0,Math.PI/2),t.lineTo(i+a,s+r),t.arc(i+a,s+r-a,a,Math.PI/2,Math.PI),t.lineTo(i,s+a),t.arc(i+a,s+a,a,Math.PI,3*Math.PI/2),t.closePath()}_clipForChildren(t){this._cornerRadius&&(this._drawRoundedRect(t,this._thickness),t.clip())}}n([_()],Bt.prototype,"thickness",null);n([_()],Bt.prototype,"cornerRadius",null);F("BABYLON.GUI.Rectangle",Bt);var Kt;(function(x){x[x.Clip=0]="Clip",x[x.WordWrap=1]="WordWrap",x[x.Ellipsis=2]="Ellipsis",x[x.WordWrapEllipsis=3]="WordWrapEllipsis"})(Kt||(Kt={}));class U extends c{get lines(){return this._lines}get resizeToFit(){return this._resizeToFit}set resizeToFit(t){this._resizeToFit!==t&&(this._resizeToFit=t,this._resizeToFit&&(this._width.ignoreAdaptiveScaling=!0,this._height.ignoreAdaptiveScaling=!0),this._markAsDirty())}get textWrapping(){return this._textWrapping}set textWrapping(t){this._textWrapping!==t&&(this._textWrapping=+t,this._markAsDirty())}get text(){return this._text}set text(t){this._text!==t&&(this._text=t+"",this._markAsDirty(),this.onTextChangedObservable.notifyObservers(this))}get textHorizontalAlignment(){return this._textHorizontalAlignment}set textHorizontalAlignment(t){this._textHorizontalAlignment!==t&&(this._textHorizontalAlignment=t,this._markAsDirty())}get textVerticalAlignment(){return this._textVerticalAlignment}set textVerticalAlignment(t){this._textVerticalAlignment!==t&&(this._textVerticalAlignment=t,this._markAsDirty())}set lineSpacing(t){this._lineSpacing.fromString(t)&&this._markAsDirty()}get lineSpacing(){return this._lineSpacing.toString(this._host)}get outlineWidth(){return this._outlineWidth}set outlineWidth(t){this._outlineWidth!==t&&(this._outlineWidth=t,this._markAsDirty())}get underline(){return this._underline}set underline(t){this._underline!==t&&(this._underline=t,this._markAsDirty())}get lineThrough(){return this._lineThrough}set lineThrough(t){this._lineThrough!==t&&(this._lineThrough=t,this._markAsDirty())}get outlineColor(){return this._outlineColor}set outlineColor(t){this._outlineColor!==t&&(this._outlineColor=t,this._markAsDirty())}get wordDivider(){return this._wordDivider}set wordDivider(t){this._wordDivider!==t&&(this._wordDivider=t,this._markAsDirty())}get forceResizeWidth(){return this._forceResizeWidth}set forceResizeWidth(t){this._forceResizeWidth!==t&&(this._forceResizeWidth=t,this._markAsDirty())}constructor(t,e=""){super(t),this.name=t,this._text="",this._textWrapping=Kt.Clip,this._textHorizontalAlignment=c.HORIZONTAL_ALIGNMENT_CENTER,this._textVerticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,this._resizeToFit=!1,this._lineSpacing=new p(0),this._outlineWidth=0,this._outlineColor="white",this._underline=!1,this._lineThrough=!1,this._wordDivider=" ",this._forceResizeWidth=!1,this.onTextChangedObservable=new T,this.onLinesReadyObservable=new T,this._linesTemp=[],this.text=e}_getTypeName(){return"TextBlock"}_processMeasures(t,e){(!this._fontOffset||this.isDirty)&&(this._fontOffset=c._GetFontOffset(e.font)),super._processMeasures(t,e),this._lines=this._breakLines(this._currentMeasure.width,this._currentMeasure.height,e),this.onLinesReadyObservable.notifyObservers(this);let i=0;for(let s=0;s<this._lines.length;s++){const o=this._lines[s];o.width>i&&(i=o.width)}if(this._resizeToFit){if(this._textWrapping===Kt.Clip||this._forceResizeWidth){const o=Math.ceil(this._paddingLeftInPixels)+Math.ceil(this._paddingRightInPixels)+Math.ceil(i);o!==this._width.getValueInPixel(this._host,this._tempParentMeasure.width)&&(this._width.updateInPlace(o,p.UNITMODE_PIXEL),this._rebuildLayout=!0)}let s=this._paddingTopInPixels+this._paddingBottomInPixels+this._fontOffset.height*this._lines.length|0;if(this._lines.length>0&&this._lineSpacing.internalValue!==0){let o=0;this._lineSpacing.isPixel?o=this._lineSpacing.getValue(this._host):o=this._lineSpacing.getValue(this._host)*this._height.getValueInPixel(this._host,this._cachedParentMeasure.height),s+=(this._lines.length-1)*o}s!==this._height.internalValue&&(this._height.updateInPlace(s,p.UNITMODE_PIXEL),this._rebuildLayout=!0)}}_drawText(t,e,i,s){const o=this._currentMeasure.width;let r=0;switch(this._textHorizontalAlignment){case c.HORIZONTAL_ALIGNMENT_LEFT:r=0;break;case c.HORIZONTAL_ALIGNMENT_RIGHT:r=o-e;break;case c.HORIZONTAL_ALIGNMENT_CENTER:r=(o-e)/2;break}(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(s.shadowColor=this.shadowColor,s.shadowBlur=this.shadowBlur,s.shadowOffsetX=this.shadowOffsetX,s.shadowOffsetY=this.shadowOffsetY),this.outlineWidth&&s.strokeText(t,this._currentMeasure.left+r,i),s.fillText(t,this._currentMeasure.left+r,i),this._underline&&(s.beginPath(),s.lineWidth=Math.round(this.fontSizeInPixels*.05),s.moveTo(this._currentMeasure.left+r,i+3),s.lineTo(this._currentMeasure.left+r+e,i+3),s.stroke(),s.closePath()),this._lineThrough&&(s.beginPath(),s.lineWidth=Math.round(this.fontSizeInPixels*.05),s.moveTo(this._currentMeasure.left+r,i-this.fontSizeInPixels/3),s.lineTo(this._currentMeasure.left+r+e,i-this.fontSizeInPixels/3),s.stroke(),s.closePath())}_draw(t){t.save(),this._applyStates(t),this._renderLines(t),t.restore()}_applyStates(t){super._applyStates(t),this.outlineWidth&&(t.lineWidth=this.outlineWidth,t.strokeStyle=this.outlineColor,t.lineJoin="miter",t.miterLimit=2)}_breakLines(t,e,i){this._linesTemp.length=0;const s=this.text.split(`
`);if(this._textWrapping===Kt.Ellipsis)for(const o of s)this._linesTemp.push(this._parseLineEllipsis(o,t,i));else if(this._textWrapping===Kt.WordWrap)for(const o of s)this._linesTemp.push(...this._parseLineWordWrap(o,t,i));else if(this._textWrapping===Kt.WordWrapEllipsis)for(const o of s)this._linesTemp.push(...this._parseLineWordWrapEllipsis(o,t,e,i));else for(const o of s)this._linesTemp.push(this._parseLine(o,i));return this._linesTemp}_parseLine(t="",e){return{text:t,width:this._getTextMetricsWidth(e.measureText(t))}}_getCharsToRemove(t,e,i){const s=t>e?t-e:0,o=t/i;return Math.max(Math.floor(s/o),1)}_parseLineEllipsis(t="",e,i){let s=this._getTextMetricsWidth(i.measureText(t)),o=this._getCharsToRemove(s,e,t.length);const r=Array.from&&Array.from(t);if(r)for(;r.length&&s>e;)r.splice(r.length-o,o),t=`${r.join("")}…`,s=this._getTextMetricsWidth(i.measureText(t)),o=this._getCharsToRemove(s,e,t.length);else{for(;t.length>2&&s>e;)t=t.slice(0,-o),s=this._getTextMetricsWidth(i.measureText(t+"…")),o=this._getCharsToRemove(s,e,t.length);t+="…"}return{text:t,width:s}}_getTextMetricsWidth(t){return t.actualBoundingBoxLeft!==void 0?Math.abs(t.actualBoundingBoxLeft)+Math.abs(t.actualBoundingBoxRight):t.width}_parseLineWordWrap(t="",e,i){const s=[],o=this.wordSplittingFunction?this.wordSplittingFunction(t):t.split(this._wordDivider);let r=this._getTextMetricsWidth(i.measureText(t));for(let a=0;a<o.length;a++){const l=a>0?t+this._wordDivider+o[a]:o[0],h=this._getTextMetricsWidth(i.measureText(l));h>e&&a>0?(s.push({text:t,width:r}),t=o[a],r=this._getTextMetricsWidth(i.measureText(t))):(r=h,t=l)}return s.push({text:t,width:r}),s}_parseLineWordWrapEllipsis(t="",e,i,s){const o=this._parseLineWordWrap(t,e,s);for(let r=1;r<=o.length;r++)if(this._computeHeightForLinesOf(r)>i&&r>1){const l=o[r-2],h=o[r-1];o[r-2]=this._parseLineEllipsis(l.text+this._wordDivider+h.text,e,s);const f=o.length-r+1;for(let d=0;d<f;d++)o.pop();return o}return o}_renderLines(t){if(!this._fontOffset||!this._lines)return;const e=this._currentMeasure.height;let i=0;switch(this._textVerticalAlignment){case c.VERTICAL_ALIGNMENT_TOP:i=this._fontOffset.ascent;break;case c.VERTICAL_ALIGNMENT_BOTTOM:i=e-this._fontOffset.height*(this._lines.length-1)-this._fontOffset.descent;break;case c.VERTICAL_ALIGNMENT_CENTER:i=this._fontOffset.ascent+(e-this._fontOffset.height*this._lines.length)/2;break}i+=this._currentMeasure.top;for(let s=0;s<this._lines.length;s++){const o=this._lines[s];s!==0&&this._lineSpacing.internalValue!==0&&(this._lineSpacing.isPixel?i+=this._lineSpacing.getValue(this._host):i=i+this._lineSpacing.getValue(this._host)*this._height.getValueInPixel(this._host,this._cachedParentMeasure.height)),this._drawText(o.text,o.width,i,t),i+=this._fontOffset.height}}_computeHeightForLinesOf(t){let e=this._paddingTopInPixels+this._paddingBottomInPixels+this._fontOffset.height*t;if(t>0&&this._lineSpacing.internalValue!==0){let i=0;this._lineSpacing.isPixel?i=this._lineSpacing.getValue(this._host):i=this._lineSpacing.getValue(this._host)*this._height.getValueInPixel(this._host,this._cachedParentMeasure.height),e+=(t-1)*i}return e}computeExpectedHeight(){var t;if(this.text&&this.widthInPixels){const e=(t=ne.LastCreatedEngine)===null||t===void 0?void 0:t.createCanvas(0,0).getContext("2d");if(e){this._applyStates(e),this._fontOffset||(this._fontOffset=c._GetFontOffset(e.font));const i=this._lines?this._lines:this._breakLines(this.widthInPixels-this._paddingLeftInPixels-this._paddingRightInPixels,this.heightInPixels-this._paddingTopInPixels-this._paddingBottomInPixels,e);return this._computeHeightForLinesOf(i.length)}}return 0}dispose(){super.dispose(),this.onTextChangedObservable.clear()}}n([_()],U.prototype,"resizeToFit",null);n([_()],U.prototype,"textWrapping",null);n([_()],U.prototype,"text",null);n([_()],U.prototype,"textHorizontalAlignment",null);n([_()],U.prototype,"textVerticalAlignment",null);n([_()],U.prototype,"lineSpacing",null);n([_()],U.prototype,"outlineWidth",null);n([_()],U.prototype,"underline",null);n([_()],U.prototype,"lineThrough",null);n([_()],U.prototype,"outlineColor",null);n([_()],U.prototype,"wordDivider",null);n([_()],U.prototype,"forceResizeWidth",null);F("BABYLON.GUI.TextBlock",U);class y extends c{get isLoaded(){return this._loaded}isReady(){return this.isLoaded}get detectPointerOnOpaqueOnly(){return this._detectPointerOnOpaqueOnly}set detectPointerOnOpaqueOnly(t){this._detectPointerOnOpaqueOnly!==t&&(this._detectPointerOnOpaqueOnly=t)}get sliceLeft(){return this._sliceLeft}set sliceLeft(t){this._sliceLeft!==t&&(this._sliceLeft=t,this._markAsDirty())}get sliceRight(){return this._sliceRight}set sliceRight(t){this._sliceRight!==t&&(this._sliceRight=t,this._markAsDirty())}get sliceTop(){return this._sliceTop}set sliceTop(t){this._sliceTop!==t&&(this._sliceTop=t,this._markAsDirty())}get sliceBottom(){return this._sliceBottom}set sliceBottom(t){this._sliceBottom!==t&&(this._sliceBottom=t,this._markAsDirty())}get sourceLeft(){return this._sourceLeft}set sourceLeft(t){this._sourceLeft!==t&&(this._sourceLeft=t,this._markAsDirty())}get sourceTop(){return this._sourceTop}set sourceTop(t){this._sourceTop!==t&&(this._sourceTop=t,this._markAsDirty())}get sourceWidth(){return this._sourceWidth}set sourceWidth(t){this._sourceWidth!==t&&(this._sourceWidth=t,this._markAsDirty())}get sourceHeight(){return this._sourceHeight}set sourceHeight(t){this._sourceHeight!==t&&(this._sourceHeight=t,this._markAsDirty())}get imageWidth(){return this._imageWidth}get imageHeight(){return this._imageHeight}get populateNinePatchSlicesFromImage(){return this._populateNinePatchSlicesFromImage}set populateNinePatchSlicesFromImage(t){this._populateNinePatchSlicesFromImage!==t&&(this._populateNinePatchSlicesFromImage=t,this._populateNinePatchSlicesFromImage&&this._loaded&&this._extractNinePatchSliceDataFromImage())}get isSVG(){return this._isSVG}get svgAttributesComputationCompleted(){return this._svgAttributesComputationCompleted}get autoScale(){return this._autoScale}set autoScale(t){this._autoScale!==t&&(this._autoScale=t,t&&this._loaded&&this.synchronizeSizeWithContent())}get stretch(){return this._stretch}set stretch(t){this._stretch!==t&&(this._stretch=t,this._markAsDirty())}_rotate90(t,e=!1){var i,s;const o=this._domImage.width,r=this._domImage.height,a=((s=(i=this._host)===null||i===void 0?void 0:i.getScene())===null||s===void 0?void 0:s.getEngine())||ne.LastCreatedEngine;if(!a)throw new Error("Invalid engine. Unable to create a canvas.");const l=a.createCanvas(r,o),h=l.getContext("2d");h.translate(l.width/2,l.height/2),h.rotate(t*Math.PI/2),h.drawImage(this._domImage,0,0,o,r,-o/2,-r/2,o,r);const f=l.toDataURL("image/jpg"),d=new y(this.name+"rotated",f);return e&&(d._stretch=this._stretch,d._autoScale=this._autoScale,d._cellId=this._cellId,d._cellWidth=t%1?this._cellHeight:this._cellWidth,d._cellHeight=t%1?this._cellWidth:this._cellHeight),this._handleRotationForSVGImage(this,d,t),this._imageDataCache.data=null,d}_handleRotationForSVGImage(t,e,i){t._isSVG&&(t._svgAttributesComputationCompleted?(this._rotate90SourceProperties(t,e,i),this._markAsDirty()):t.onSVGAttributesComputedObservable.addOnce(()=>{this._rotate90SourceProperties(t,e,i),this._markAsDirty()}))}_rotate90SourceProperties(t,e,i){let s=t.sourceLeft,o=t.sourceTop,r=t.domImage.width,a=t.domImage.height,l=s,h=o,f=t.sourceWidth,d=t.sourceHeight;if(i!=0){const u=i<0?-1:1;i=i%4;for(let I=0;I<Math.abs(i);++I)l=-(o-a/2)*u+a/2,h=(s-r/2)*u+r/2,[f,d]=[d,f],i<0?h-=d:l-=f,s=l,o=h,[r,a]=[a,r]}e.sourceLeft=l,e.sourceTop=h,e.sourceWidth=f,e.sourceHeight=d}_extractNinePatchSliceDataFromImage(){var t,e;const i=this._domImage.width,s=this._domImage.height;if(!this._workingCanvas){const l=((e=(t=this._host)===null||t===void 0?void 0:t.getScene())===null||e===void 0?void 0:e.getEngine())||ne.LastCreatedEngine;if(!l)throw new Error("Invalid engine. Unable to create a canvas.");this._workingCanvas=l.createCanvas(i,s)}const r=this._workingCanvas.getContext("2d");r.drawImage(this._domImage,0,0,i,s);const a=r.getImageData(0,0,i,s);this._sliceLeft=-1,this._sliceRight=-1;for(let l=0;l<i;l++){const h=a.data[l*4+3];if(h>127&&this._sliceLeft===-1){this._sliceLeft=l;continue}if(h<127&&this._sliceLeft>-1){this._sliceRight=l;break}}this._sliceTop=-1,this._sliceBottom=-1;for(let l=0;l<s;l++){const h=a.data[l*i*4+3];if(h>127&&this._sliceTop===-1){this._sliceTop=l;continue}if(h<127&&this._sliceTop>-1){this._sliceBottom=l;break}}}set domImage(t){this._domImage=t,this._loaded=!1,this._imageDataCache.data=null,this._domImage.width?this._onImageLoaded():this._domImage.onload=()=>{this._onImageLoaded()}}get domImage(){return this._domImage}_onImageLoaded(){this._imageDataCache.data=null,this._imageWidth=this._domImage.width,this._imageHeight=this._domImage.height,this._loaded=!0,this._populateNinePatchSlicesFromImage&&this._extractNinePatchSliceDataFromImage(),this._autoScale&&this.synchronizeSizeWithContent(),this.onImageLoadedObservable.notifyObservers(this),this._markAsDirty()}get source(){return this._source}static ResetImageCache(){y.SourceImgCache.clear()}_removeCacheUsage(t){const e=t&&y.SourceImgCache.get(t);e&&(e.timesUsed-=1,e.timesUsed===0&&y.SourceImgCache.delete(t))}set source(t){var e,i;if(this._source===t)return;this._removeCacheUsage(this._source),this._loaded=!1,this._source=t,this._imageDataCache.data=null,t&&(t=this._svgCheck(t));const s=((i=(e=this._host)===null||e===void 0?void 0:e.getScene())===null||i===void 0?void 0:i.getEngine())||ne.LastCreatedEngine;if(!s)throw new Error("Invalid engine. Unable to create a canvas.");if(t&&y.SourceImgCache.has(t)){const o=y.SourceImgCache.get(t);this._domImage=o.img,o.timesUsed+=1,o.loaded?this._onImageLoaded():o.waitingForLoadCallback.push(this._onImageLoaded.bind(this));return}this._domImage=s.createCanvasImage(),t&&y.SourceImgCache.set(t,{img:this._domImage,timesUsed:1,loaded:!1,waitingForLoadCallback:[this._onImageLoaded.bind(this)]}),this._domImage.onload=()=>{if(t){const o=y.SourceImgCache.get(t);if(o){o.loaded=!0;for(const r of o.waitingForLoadCallback)r();o.waitingForLoadCallback.length=0;return}}this._onImageLoaded()},t&&(gt.SetCorsBehavior(t,this._domImage),gt.SetReferrerPolicyBehavior(this.referrerPolicy,this._domImage),this._domImage.src=t)}_svgCheck(t){if(window.SVGSVGElement&&t.search(/.svg#/gi)!==-1&&t.indexOf("#")===t.lastIndexOf("#")){this._isSVG=!0;const e=t.split("#")[0],i=t.split("#")[1],s=document.body.querySelector('object[data="'+e+'"]');if(s){const o=s.contentDocument;if(o&&o.documentElement){const r=o.documentElement.getAttribute("viewBox"),a=Number(o.documentElement.getAttribute("width")),l=Number(o.documentElement.getAttribute("height"));if(o.getElementById(i)&&r&&a&&l)return this._getSVGAttribs(s,i),t}s.addEventListener("load",()=>{this._getSVGAttribs(s,i)})}else{const o=document.createElement("object");o.data=e,o.type="image/svg+xml",o.width="0%",o.height="0%",document.body.appendChild(o),o.onload=()=>{const r=document.body.querySelector('object[data="'+e+'"]');r&&this._getSVGAttribs(r,i)}}return e}else return t}_getSVGAttribs(t,e){const i=t.contentDocument;if(i&&i.documentElement){const s=i.documentElement.getAttribute("viewBox"),o=Number(i.documentElement.getAttribute("width")),r=Number(i.documentElement.getAttribute("height")),a=i.getElementById(e);if(s&&o&&r&&a){const l=Number(s.split(" ")[2]),h=Number(s.split(" ")[3]),f=a.getBBox();let d=1,u=1,I=0,k=0;const It=a.transform.baseVal.consolidate().matrix;a.transform&&a.transform.baseVal.consolidate()&&(d=It.a,u=It.d,I=It.e,k=It.f),this.sourceLeft=(d*f.x+I)*o/l,this.sourceTop=(u*f.y+k)*r/h,this.sourceWidth=f.width*d*(o/l),this.sourceHeight=f.height*u*(r/h),this._svgAttributesComputationCompleted=!0,this.onSVGAttributesComputedObservable.notifyObservers(this)}}}get cellWidth(){return this._cellWidth}set cellWidth(t){this._cellWidth!==t&&(this._cellWidth=t,this._markAsDirty())}get cellHeight(){return this._cellHeight}set cellHeight(t){this._cellHeight!==t&&(this._cellHeight=t,this._markAsDirty())}get cellId(){return this._cellId}set cellId(t){this._cellId!==t&&(this._cellId=t,this._markAsDirty())}constructor(t,e=null){super(t),this.name=t,this._workingCanvas=null,this._loaded=!1,this._stretch=y.STRETCH_FILL,this._autoScale=!1,this._sourceLeft=0,this._sourceTop=0,this._sourceWidth=0,this._sourceHeight=0,this._svgAttributesComputationCompleted=!1,this._isSVG=!1,this._cellWidth=0,this._cellHeight=0,this._cellId=-1,this._populateNinePatchSlicesFromImage=!1,this._imageDataCache={data:null,key:""},this.onImageLoadedObservable=new T,this.onSVGAttributesComputedObservable=new T,this.source=e}contains(t,e){if(!super.contains(t,e))return!1;if(!this._detectPointerOnOpaqueOnly||!this._workingCanvas)return!0;const i=this._currentMeasure.width|0,s=this._currentMeasure.height|0,o=i+"_"+s;let r=this._imageDataCache.data;if(!r||this._imageDataCache.key!==o){const h=this._workingCanvas.getContext("2d");this._imageDataCache.data=r=h.getImageData(0,0,i,s).data,this._imageDataCache.key=o}return t=t-this._currentMeasure.left|0,e=e-this._currentMeasure.top|0,r[(t+e*i)*4+3]>0}_getTypeName(){return"Image"}synchronizeSizeWithContent(){this._loaded&&(this.width=this._domImage.width+"px",this.height=this._domImage.height+"px")}_processMeasures(t,e){if(this._loaded)switch(this._stretch){case y.STRETCH_NONE:break;case y.STRETCH_FILL:break;case y.STRETCH_UNIFORM:break;case y.STRETCH_NINE_PATCH:break;case y.STRETCH_EXTEND:this._autoScale&&this.synchronizeSizeWithContent(),this.parent&&this.parent.parent&&(this.parent.adaptWidthToChildren=!0,this.parent.adaptHeightToChildren=!0);break}super._processMeasures(t,e)}_prepareWorkingCanvasForOpaqueDetection(){var t,e;if(!this._detectPointerOnOpaqueOnly)return;const i=this._currentMeasure.width,s=this._currentMeasure.height;if(!this._workingCanvas){const a=((e=(t=this._host)===null||t===void 0?void 0:t.getScene())===null||e===void 0?void 0:e.getEngine())||ne.LastCreatedEngine;if(!a)throw new Error("Invalid engine. Unable to create a canvas.");this._workingCanvas=a.createCanvas(i,s)}this._workingCanvas.getContext("2d").clearRect(0,0,i,s)}_drawImage(t,e,i,s,o,r,a,l,h){if(t.drawImage(this._domImage,e,i,s,o,r,a,l,h),!this._detectPointerOnOpaqueOnly)return;t=this._workingCanvas.getContext("2d"),t.drawImage(this._domImage,e,i,s,o,r-this._currentMeasure.left,a-this._currentMeasure.top,l,h)}_draw(t){t.save(),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY);let e,i,s,o;if(this.cellId==-1)e=this._sourceLeft,i=this._sourceTop,s=this._sourceWidth?this._sourceWidth:this._imageWidth,o=this._sourceHeight?this._sourceHeight:this._imageHeight;else{const r=this._domImage.naturalWidth/this.cellWidth,a=this.cellId/r>>0,l=this.cellId%r;e=this.cellWidth*l,i=this.cellHeight*a,s=this.cellWidth,o=this.cellHeight}if(this._prepareWorkingCanvasForOpaqueDetection(),this._applyStates(t),this._loaded)switch(this._stretch){case y.STRETCH_NONE:this._drawImage(t,e,i,s,o,this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height);break;case y.STRETCH_FILL:this._drawImage(t,e,i,s,o,this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height);break;case y.STRETCH_UNIFORM:{const r=this._currentMeasure.width/s,a=this._currentMeasure.height/o,l=Math.min(r,a),h=(this._currentMeasure.width-s*l)/2,f=(this._currentMeasure.height-o*l)/2;this._drawImage(t,e,i,s,o,this._currentMeasure.left+h,this._currentMeasure.top+f,s*l,o*l);break}case y.STRETCH_EXTEND:this._drawImage(t,e,i,s,o,this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height);break;case y.STRETCH_NINE_PATCH:this._renderNinePatch(t);break}t.restore()}_renderNinePatch(t){const e=this._sliceLeft,i=this._sliceTop,s=this._imageHeight-this._sliceBottom,o=this._imageWidth-this._sliceRight,r=this._sliceRight-this._sliceLeft,a=this._sliceBottom-this._sliceTop,l=this._currentMeasure.width-o-e+2,h=this._currentMeasure.height-s-i+2,f=this._currentMeasure.left+e-1,d=this._currentMeasure.top+i-1,u=this._currentMeasure.left+this._currentMeasure.width-o,I=this._currentMeasure.top+this._currentMeasure.height-s;this._drawImage(t,0,0,e,i,this._currentMeasure.left,this._currentMeasure.top,e,i),t.clearRect(f,this._currentMeasure.top,l,i),this._drawImage(t,this._sliceLeft,0,r,i,f,this._currentMeasure.top,l,i),t.clearRect(u,this._currentMeasure.top,o,i),this._drawImage(t,this._sliceRight,0,o,i,u,this._currentMeasure.top,o,i),t.clearRect(this._currentMeasure.left,d,e,h),this._drawImage(t,0,this._sliceTop,e,a,this._currentMeasure.left,d,e,h),t.clearRect(f,d,l,h),this._drawImage(t,this._sliceLeft,this._sliceTop,r,a,f,d,l,h),t.clearRect(u,d,o,h),this._drawImage(t,this._sliceRight,this._sliceTop,o,a,u,d,o,h),t.clearRect(this._currentMeasure.left,I,e,s),this._drawImage(t,0,this._sliceBottom,e,s,this._currentMeasure.left,I,e,s),t.clearRect(f,I,l,s),this._drawImage(t,this.sliceLeft,this._sliceBottom,r,s,f,I,l,s),t.clearRect(u,I,o,s),this._drawImage(t,this._sliceRight,this._sliceBottom,o,s,u,I,o,s)}dispose(){super.dispose(),this.onImageLoadedObservable.clear(),this.onSVGAttributesComputedObservable.clear(),this._removeCacheUsage(this._source)}}y.SourceImgCache=new Map;y.STRETCH_NONE=0;y.STRETCH_FILL=1;y.STRETCH_UNIFORM=2;y.STRETCH_EXTEND=3;y.STRETCH_NINE_PATCH=4;n([_()],y.prototype,"detectPointerOnOpaqueOnly",null);n([_()],y.prototype,"sliceLeft",null);n([_()],y.prototype,"sliceRight",null);n([_()],y.prototype,"sliceTop",null);n([_()],y.prototype,"sliceBottom",null);n([_()],y.prototype,"sourceLeft",null);n([_()],y.prototype,"sourceTop",null);n([_()],y.prototype,"sourceWidth",null);n([_()],y.prototype,"sourceHeight",null);n([_()],y.prototype,"populateNinePatchSlicesFromImage",null);n([_()],y.prototype,"autoScale",null);n([_()],y.prototype,"stretch",null);n([_()],y.prototype,"source",null);n([_()],y.prototype,"cellWidth",null);n([_()],y.prototype,"cellHeight",null);n([_()],y.prototype,"cellId",null);F("BABYLON.GUI.Image",y);class Qt extends Bt{get image(){return this._image}get textBlock(){return this._textBlock}constructor(t){super(t),this.name=t,this.delegatePickingToChildren=!1,this.thickness=1,this.isPointerBlocker=!0;let e=null;this.pointerEnterAnimation=()=>{e=this.alpha,this.alpha-=.1},this.pointerOutAnimation=()=>{e!==null&&(this.alpha=e)},this.pointerDownAnimation=()=>{this.scaleX-=.05,this.scaleY-=.05},this.pointerUpAnimation=()=>{this.scaleX+=.05,this.scaleY+=.05}}_getTypeName(){return"Button"}_processPicking(t,e,i,s,o,r,a,l){if(!this._isEnabled||!this.isHitTestVisible||!this.isVisible||this.notRenderable||!super.contains(t,e))return!1;if(this.delegatePickingToChildren){let h=!1;for(let f=this._children.length-1;f>=0;f--){const d=this._children[f];if(d.isEnabled&&d.isHitTestVisible&&d.isVisible&&!d.notRenderable&&d.contains(t,e)){h=!0;break}}if(!h)return!1}return this._processObservables(s,t,e,i,o,r,a,l),!0}_onPointerEnter(t,e){return super._onPointerEnter(t,e)?(!this.isReadOnly&&this.pointerEnterAnimation&&this.pointerEnterAnimation(),!0):!1}_onPointerOut(t,e,i=!1){!this.isReadOnly&&this.pointerOutAnimation&&this.pointerOutAnimation(),super._onPointerOut(t,e,i)}_onPointerDown(t,e,i,s,o){return super._onPointerDown(t,e,i,s,o)?(!this.isReadOnly&&this.pointerDownAnimation&&this.pointerDownAnimation(),!0):!1}_getRectangleFill(t){return this.isEnabled?this._getBackgroundColor(t):this._disabledColor}_onPointerUp(t,e,i,s,o,r){!this.isReadOnly&&this.pointerUpAnimation&&this.pointerUpAnimation(),super._onPointerUp(t,e,i,s,o,r)}serialize(t){super.serialize(t),this._textBlock&&(t.textBlockName=this._textBlock.name),this._image&&(t.imageName=this._image.name)}_parseFromContent(t,e){super._parseFromContent(t,e),t.textBlockName&&(this._textBlock=this.getChildByName(t.textBlockName)),t.imageName&&(this._image=this.getChildByName(t.imageName))}static CreateImageButton(t,e,i){const s=new this(t),o=new U(t+"_button",e);o.textWrapping=!0,o.textHorizontalAlignment=c.HORIZONTAL_ALIGNMENT_CENTER,o.paddingLeft="20%",s.addControl(o);const r=new y(t+"_icon",i);return r.width="20%",r.stretch=y.STRETCH_UNIFORM,r.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,s.addControl(r),s._image=r,s._textBlock=o,s}static CreateImageOnlyButton(t,e){const i=new this(t),s=new y(t+"_icon",e);return s.stretch=y.STRETCH_FILL,s.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,i.addControl(s),i._image=s,i}static CreateSimpleButton(t,e){const i=new this(t),s=new U(t+"_button",e);return s.textWrapping=!0,s.textHorizontalAlignment=c.HORIZONTAL_ALIGNMENT_CENTER,i.addControl(s),i._textBlock=s,i}static CreateImageWithCenterTextButton(t,e,i){const s=new this(t),o=new y(t+"_icon",i);o.stretch=y.STRETCH_FILL,s.addControl(o);const r=new U(t+"_button",e);return r.textWrapping=!0,r.textHorizontalAlignment=c.HORIZONTAL_ALIGNMENT_CENTER,s.addControl(r),s._image=o,s._textBlock=r,s}}F("BABYLON.GUI.Button",Qt);class St extends ht{get isVertical(){return this._isVertical}set isVertical(t){this._isVertical!==t&&(this._isVertical=t,this._markAsDirty())}get spacing(){return this._spacing}set spacing(t){this._spacing!==t&&(this._spacing=t,this._markAsDirty())}set width(t){this._doNotTrackManualChanges||(this._manualWidth=!0),this._width.toString(this._host)!==t&&this._width.fromString(t)&&this._markAsDirty()}get width(){return this._width.toString(this._host)}set height(t){this._doNotTrackManualChanges||(this._manualHeight=!0),this._height.toString(this._host)!==t&&this._height.fromString(t)&&this._markAsDirty()}get height(){return this._height.toString(this._host)}constructor(t){super(t),this.name=t,this._isVertical=!0,this._manualWidth=!1,this._manualHeight=!1,this._doNotTrackManualChanges=!1,this._spacing=0,this.ignoreLayoutWarnings=!1}_getTypeName(){return"StackPanel"}_preMeasure(t,e){for(const i of this._children)this._isVertical?i.verticalAlignment=c.VERTICAL_ALIGNMENT_TOP:i.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT;super._preMeasure(t,e)}_additionalProcessing(t,e){super._additionalProcessing(t,e),this._measureForChildren.copyFrom(t),this._measureForChildren.left=this._currentMeasure.left,this._measureForChildren.top=this._currentMeasure.top,(!this.isVertical||this._manualWidth)&&(this._measureForChildren.width=this._currentMeasure.width),(this.isVertical||this._manualHeight)&&(this._measureForChildren.height=this._currentMeasure.height)}_postMeasure(){let t=0,e=0;const i=this._children.length;for(let r=0;r<i;r++){const a=this._children[r];!a.isVisible||a.notRenderable||(this._isVertical?(a.top!==e+"px"&&(a.top=e+"px",this._rebuildLayout=!0,a._top.ignoreAdaptiveScaling=!0),a._height.isPercentage&&!a._automaticSize?this.ignoreLayoutWarnings||gt.Warn(`Control (Name:${a.name}, UniqueId:${a.uniqueId}) is using height in percentage mode inside a vertical StackPanel`):e+=a._currentMeasure.height+a._paddingTopInPixels+a._paddingBottomInPixels+(r<i-1?this._spacing:0)):(a.left!==t+"px"&&(a.left=t+"px",this._rebuildLayout=!0,a._left.ignoreAdaptiveScaling=!0),a._width.isPercentage&&!a._automaticSize&&a.getClassName()==="TextBlock"&&a.textWrapping!==Kt.Clip&&!a.forceResizeWidth?this.ignoreLayoutWarnings||gt.Warn(`Control (Name:${a.name}, UniqueId:${a.uniqueId}) is using width in percentage mode inside a horizontal StackPanel`):t+=a._currentMeasure.width+a._paddingLeftInPixels+a._paddingRightInPixels+(r<i-1?this._spacing:0)))}t+=this._paddingLeftInPixels+this._paddingRightInPixels,e+=this._paddingTopInPixels+this._paddingBottomInPixels,this._doNotTrackManualChanges=!0;let s=!1,o=!1;if((!this._manualHeight||this.adaptHeightToChildren)&&this._isVertical){const r=this.height;this.height=e+"px",o=r!==this.height||!this._height.ignoreAdaptiveScaling}if((!this._manualWidth||this.adaptWidthToChildren)&&!this._isVertical){const r=this.width;this.width=t+"px",s=r!==this.width||!this._width.ignoreAdaptiveScaling}o&&(this._height.ignoreAdaptiveScaling=!0),s&&(this._width.ignoreAdaptiveScaling=!0),this._doNotTrackManualChanges=!1,(s||o)&&(this._rebuildLayout=!0),super._postMeasure()}serialize(t){super.serialize(t),t.manualWidth=this._manualWidth,t.manualHeight=this._manualHeight}_parseFromContent(t,e){this._manualWidth=t.manualWidth,this._manualHeight=t.manualHeight,super._parseFromContent(t,e)}}n([_()],St.prototype,"ignoreLayoutWarnings",void 0);n([_()],St.prototype,"isVertical",null);n([_()],St.prototype,"spacing",null);n([_()],St.prototype,"width",null);n([_()],St.prototype,"height",null);F("BABYLON.GUI.StackPanel",St);class _e extends c{get thickness(){return this._thickness}set thickness(t){this._thickness!==t&&(this._thickness=t,this._markAsDirty())}get checkSizeRatio(){return this._checkSizeRatio}set checkSizeRatio(t){t=Math.max(Math.min(1,t),0),this._checkSizeRatio!==t&&(this._checkSizeRatio=t,this._markAsDirty())}get background(){return this._background}set background(t){this._background!==t&&(this._background=t,this._markAsDirty())}get isChecked(){return this._isChecked}set isChecked(t){this._isChecked!==t&&(this._isChecked=t,this._markAsDirty(),this.onIsCheckedChangedObservable.notifyObservers(t))}constructor(t){super(t),this.name=t,this._isChecked=!1,this._background="black",this._checkSizeRatio=.8,this._thickness=1,this.onIsCheckedChangedObservable=new T,this.isPointerBlocker=!0}_getTypeName(){return"Checkbox"}_draw(t){t.save(),this._applyStates(t);const e=this._currentMeasure.width-this._thickness,i=this._currentMeasure.height-this._thickness;if((this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),t.fillStyle=this._isEnabled?this._background:this._disabledColor,t.fillRect(this._currentMeasure.left+this._thickness/2,this._currentMeasure.top+this._thickness/2,e,i),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),this._isChecked){t.fillStyle=this._isEnabled?this.color:this._disabledColorItem;const s=e*this._checkSizeRatio,o=i*this._checkSizeRatio;t.fillRect(this._currentMeasure.left+this._thickness/2+(e-s)/2,this._currentMeasure.top+this._thickness/2+(i-o)/2,s,o)}t.strokeStyle=this.color,t.lineWidth=this._thickness,t.strokeRect(this._currentMeasure.left+this._thickness/2,this._currentMeasure.top+this._thickness/2,e,i),t.restore()}_onPointerDown(t,e,i,s,o){return super._onPointerDown(t,e,i,s,o)?(this.isReadOnly||(this.isChecked=!this.isChecked),!0):!1}static AddCheckBoxWithHeader(t,e){const i=new St;i.isVertical=!1,i.height="30px";const s=new _e;s.width="20px",s.height="20px",s.isChecked=!0,s.color="green",s.onIsCheckedChangedObservable.add(e),i.addControl(s);const o=new U;return o.text=t,o.width="180px",o.paddingLeft="5px",o.textHorizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,o.color="white",i.addControl(o),i}}n([_()],_e.prototype,"thickness",null);n([_()],_e.prototype,"checkSizeRatio",null);n([_()],_e.prototype,"background",null);n([_()],_e.prototype,"isChecked",null);F("BABYLON.GUI.Checkbox",_e);class Ke{get text(){return this._characters?this._characters.join(""):this._text}set text(t){this._text=t,this._characters=Array.from&&Array.from(t)}get length(){return this._characters?this._characters.length:this._text.length}removePart(t,e,i){if(this._text=this._text.slice(0,t)+(i||"")+this._text.slice(e),this._characters){const s=i?Array.from(i):[];this._characters.splice(t,e-t,...s)}}charAt(t){return this._characters?this._characters[t]:this._text.charAt(t)}substr(t,e){if(this._characters){isNaN(t)?t=0:t>=0?t=Math.min(t,this._characters.length):t=this._characters.length+Math.max(t,-this._characters.length),e===void 0?e=this._characters.length-t:(isNaN(e)||e<0)&&(e=0);const i=[];for(;--e>=0;)i[e]=this._characters[t+e];return i.join("")}return this._text.substr(t,e)}substring(t,e){if(this._characters){isNaN(t)?t=0:t>this._characters.length?t=this._characters.length:t<0&&(t=0),e===void 0?e=this._characters.length:isNaN(e)?e=0:e>this._characters.length?e=this._characters.length:e<0&&(e=0);const i=[];let s=0;for(;t<e;)i[s++]=this._characters[t++];return i.join("")}return this._text.substring(t,e)}isWord(t){const e=/\w/g;return this._characters?this._characters[t].search(e)!==-1:this._text.search(e)!==-1}}class z extends c{get maxWidth(){return this._maxWidth.toString(this._host)}get maxWidthInPixels(){return this._maxWidth.getValueInPixel(this._host,this._cachedParentMeasure.width)}set maxWidth(t){this._maxWidth.toString(this._host)!==t&&this._maxWidth.fromString(t)&&this._markAsDirty()}get highligherOpacity(){return this._highligherOpacity}set highligherOpacity(t){this._highligherOpacity!==t&&(this._highligherOpacity=t,this._markAsDirty())}get onFocusSelectAll(){return this._onFocusSelectAll}set onFocusSelectAll(t){this._onFocusSelectAll!==t&&(this._onFocusSelectAll=t,this._markAsDirty())}get textHighlightColor(){return this._textHighlightColor}set textHighlightColor(t){this._textHighlightColor!==t&&(this._textHighlightColor=t,this._markAsDirty())}get margin(){return this._margin.toString(this._host)}get marginInPixels(){return this._margin.getValueInPixel(this._host,this._cachedParentMeasure.width)}set margin(t){this._margin.toString(this._host)!==t&&this._margin.fromString(t)&&this._markAsDirty()}get autoStretchWidth(){return this._autoStretchWidth}set autoStretchWidth(t){this._autoStretchWidth!==t&&(this._autoStretchWidth=t,this._markAsDirty())}get thickness(){return this._thickness}set thickness(t){this._thickness!==t&&(this._thickness=t,this._markAsDirty())}get focusedBackground(){return this._focusedBackground}set focusedBackground(t){this._focusedBackground!==t&&(this._focusedBackground=t,this._markAsDirty())}get focusedColor(){return this._focusedColor}set focusedColor(t){this._focusedColor!==t&&(this._focusedColor=t,this._markAsDirty())}get background(){return this._background}set background(t){this._background!==t&&(this._background=t,this._markAsDirty())}get placeholderColor(){return this._placeholderColor}set placeholderColor(t){this._placeholderColor!==t&&(this._placeholderColor=t,this._markAsDirty())}get placeholderText(){return this._placeholderText}set placeholderText(t){this._placeholderText!==t&&(this._placeholderText=t,this._markAsDirty())}get deadKey(){return this._deadKey}set deadKey(t){this._deadKey=t}get highlightedText(){return this._highlightedText}set highlightedText(t){this._highlightedText!==t&&(this._highlightedText=t,this._markAsDirty())}get addKey(){return this._addKey}set addKey(t){this._addKey=t}get currentKey(){return this._currentKey}set currentKey(t){this._currentKey=t}get text(){return this._textWrapper.text}set text(t){const e=t.toString();this._textWrapper||(this._textWrapper=new Ke),this._textWrapper.text!==e&&(this._textWrapper.text=e,this._textHasChanged())}_textHasChanged(){this._markAsDirty(),this.onTextChangedObservable.notifyObservers(this)}get width(){return this._width.toString(this._host)}set width(t){this._width.toString(this._host)!==t&&(this._width.fromString(t)&&this._markAsDirty(),this.autoStretchWidth=!1)}constructor(t,e=""){super(t),this.name=t,this._placeholderText="",this._background="#222222",this._focusedBackground="#000000",this._focusedColor="white",this._placeholderColor="gray",this._thickness=1,this._margin=new p(10,p.UNITMODE_PIXEL),this._autoStretchWidth=!0,this._maxWidth=new p(1,p.UNITMODE_PERCENTAGE,!1),this._isFocused=!1,this._blinkIsEven=!1,this._cursorOffset=0,this._deadKey=!1,this._addKey=!0,this._currentKey="",this._isTextHighlightOn=!1,this._textHighlightColor="#d5e0ff",this._highligherOpacity=.4,this._highlightedText="",this._startHighlightIndex=0,this._endHighlightIndex=0,this._cursorIndex=-1,this._onFocusSelectAll=!1,this._isPointerDown=!1,this.promptMessage="Please enter text:",this.disableMobilePrompt=!1,this.onTextChangedObservable=new T,this.onBeforeKeyAddObservable=new T,this.onFocusObservable=new T,this.onBlurObservable=new T,this.onTextHighlightObservable=new T,this.onTextCopyObservable=new T,this.onTextCutObservable=new T,this.onTextPasteObservable=new T,this.onKeyboardEventProcessedObservable=new T,this.text=e,this.isPointerBlocker=!0}onBlur(){this._isFocused=!1,this._scrollLeft=null,this._cursorOffset=0,clearTimeout(this._blinkTimeout),this._markAsDirty(),this.onBlurObservable.notifyObservers(this),this._host.unRegisterClipboardEvents(),this._onClipboardObserver&&this._host.onClipboardObservable.remove(this._onClipboardObserver);const t=this._host.getScene();this._onPointerDblTapObserver&&t&&t.onPointerObservable.remove(this._onPointerDblTapObserver)}onFocus(){if(!this._isEnabled)return;if(this._scrollLeft=null,this._isFocused=!0,this._blinkIsEven=!1,this._cursorOffset=0,this._markAsDirty(),this.onFocusObservable.notifyObservers(this),this._focusedBy==="touch"&&!this.disableMobilePrompt){const e=prompt(this.promptMessage);e!==null&&(this.text=e),this._host.focusedControl=null;return}this._host.registerClipboardEvents(),this._onClipboardObserver=this._host.onClipboardObservable.add(e=>{switch(e.type){case me.COPY:this._onCopyText(e.event),this.onTextCopyObservable.notifyObservers(this);break;case me.CUT:this._onCutText(e.event),this.onTextCutObservable.notifyObservers(this);break;case me.PASTE:this._onPasteText(e.event),this.onTextPasteObservable.notifyObservers(this);break;default:return}});const t=this._host.getScene();t&&(this._onPointerDblTapObserver=t.onPointerObservable.add(e=>{this._isFocused&&e.type===et.POINTERDOUBLETAP&&this._processDblClick(e)})),this._onFocusSelectAll&&this._selectAllText()}focus(){this._host.moveFocusToControl(this)}blur(){this._host.focusedControl=null}_getTypeName(){return"InputText"}keepsFocusWith(){return this._connectedVirtualKeyboard?[this._connectedVirtualKeyboard]:null}processKey(t,e,i){var s;if(!this.isReadOnly&&!(i&&(i.ctrlKey||i.metaKey)&&(t===67||t===86||t===88))){if(i&&(i.ctrlKey||i.metaKey)&&t===65){this._selectAllText(),i.preventDefault();return}switch(t){case 32:e=" ";break;case 191:i&&i.preventDefault();break;case 8:if(this._textWrapper.text&&this._textWrapper.length>0){if(this.isTextHighlightOn){this._textWrapper.removePart(this._startHighlightIndex,this._endHighlightIndex),this._textHasChanged(),this.isTextHighlightOn=!1,this._cursorOffset=this._textWrapper.length-this._startHighlightIndex,this._blinkIsEven=!1,i&&i.preventDefault();return}if(this._cursorOffset===0)this.text=this._textWrapper.substr(0,this._textWrapper.length-1);else{const o=this._textWrapper.length-this._cursorOffset;o>0&&(this._textWrapper.removePart(o-1,o),this._textHasChanged())}}i&&i.preventDefault();return;case 46:if(this.isTextHighlightOn){this._textWrapper.removePart(this._startHighlightIndex,this._endHighlightIndex),this._textHasChanged(),this.isTextHighlightOn=!1,this._cursorOffset=this._textWrapper.length-this._startHighlightIndex,i&&i.preventDefault();return}if(this._textWrapper.text&&this._textWrapper.length>0&&this._cursorOffset>0){const o=this._textWrapper.length-this._cursorOffset;this._textWrapper.removePart(o,o+1),this._textHasChanged(),this._cursorOffset--}i&&i.preventDefault();return;case 13:this._host.focusedControl=null,this.isTextHighlightOn=!1;return;case 35:this._cursorOffset=0,this._blinkIsEven=!1,this.isTextHighlightOn=!1,this._markAsDirty();return;case 36:this._cursorOffset=this._textWrapper.length,this._blinkIsEven=!1,this.isTextHighlightOn=!1,this._markAsDirty();return;case 37:if(this._cursorOffset++,this._cursorOffset>this._textWrapper.length&&(this._cursorOffset=this._textWrapper.length),i&&i.shiftKey){if(this._blinkIsEven=!1,i.ctrlKey||i.metaKey){if(!this.isTextHighlightOn){if(this._textWrapper.length===this._cursorOffset)return;this._endHighlightIndex=this._textWrapper.length-this._cursorOffset+1}this._startHighlightIndex=0,this._cursorIndex=this._textWrapper.length-this._endHighlightIndex,this._cursorOffset=this._textWrapper.length,this.isTextHighlightOn=!0,this._markAsDirty();return}this.isTextHighlightOn?this._cursorIndex===-1&&(this._cursorIndex=this._textWrapper.length-this._endHighlightIndex,this._cursorOffset=this._startHighlightIndex===0?this._textWrapper.length:this._textWrapper.length-this._startHighlightIndex+1):(this.isTextHighlightOn=!0,this._cursorIndex=this._cursorOffset>=this._textWrapper.length?this._textWrapper.length:this._cursorOffset-1),this._cursorIndex<this._cursorOffset?(this._endHighlightIndex=this._textWrapper.length-this._cursorIndex,this._startHighlightIndex=this._textWrapper.length-this._cursorOffset):this._cursorIndex>this._cursorOffset?(this._endHighlightIndex=this._textWrapper.length-this._cursorOffset,this._startHighlightIndex=this._textWrapper.length-this._cursorIndex):this.isTextHighlightOn=!1,this._markAsDirty();return}this.isTextHighlightOn&&(this._cursorOffset=this._textWrapper.length-this._startHighlightIndex,this.isTextHighlightOn=!1),i&&(i.ctrlKey||i.metaKey)&&(this._cursorOffset=this._textWrapper.length,i.preventDefault()),this._blinkIsEven=!1,this.isTextHighlightOn=!1,this._cursorIndex=-1,this._markAsDirty();return;case 39:if(this._cursorOffset--,this._cursorOffset<0&&(this._cursorOffset=0),i&&i.shiftKey){if(this._blinkIsEven=!1,i.ctrlKey||i.metaKey){if(!this.isTextHighlightOn){if(this._cursorOffset===0)return;this._startHighlightIndex=this._textWrapper.length-this._cursorOffset-1}this._endHighlightIndex=this._textWrapper.length,this.isTextHighlightOn=!0,this._cursorIndex=this._textWrapper.length-this._startHighlightIndex,this._cursorOffset=0,this._markAsDirty();return}this.isTextHighlightOn?this._cursorIndex===-1&&(this._cursorIndex=this._textWrapper.length-this._startHighlightIndex,this._cursorOffset=this._textWrapper.length===this._endHighlightIndex?0:this._textWrapper.length-this._endHighlightIndex-1):(this.isTextHighlightOn=!0,this._cursorIndex=this._cursorOffset<=0?0:this._cursorOffset+1),this._cursorIndex<this._cursorOffset?(this._endHighlightIndex=this._textWrapper.length-this._cursorIndex,this._startHighlightIndex=this._textWrapper.length-this._cursorOffset):this._cursorIndex>this._cursorOffset?(this._endHighlightIndex=this._textWrapper.length-this._cursorOffset,this._startHighlightIndex=this._textWrapper.length-this._cursorIndex):this.isTextHighlightOn=!1,this._markAsDirty();return}this.isTextHighlightOn&&(this._cursorOffset=this._textWrapper.length-this._endHighlightIndex,this.isTextHighlightOn=!1),i&&(i.ctrlKey||i.metaKey)&&(this._cursorOffset=0,i.preventDefault()),this._blinkIsEven=!1,this.isTextHighlightOn=!1,this._cursorIndex=-1,this._markAsDirty();return}if(t===32&&(e=(s=i==null?void 0:i.key)!==null&&s!==void 0?s:" "),this._deadKey=e==="Dead",e&&(t===-1||t===32||t===34||t===39||t>47&&t<64||t>64&&t<91||t>159&&t<193||t>218&&t<223||t>95&&t<112)&&(this._currentKey=e,this.onBeforeKeyAddObservable.notifyObservers(this),e=this._currentKey,this._addKey&&!this._deadKey))if(this.isTextHighlightOn)this._textWrapper.removePart(this._startHighlightIndex,this._endHighlightIndex,e),this._textHasChanged(),this._cursorOffset=this._textWrapper.length-(this._startHighlightIndex+1),this.isTextHighlightOn=!1,this._blinkIsEven=!1,this._markAsDirty();else if(this._cursorOffset===0)this.text+=this._deadKey&&(i!=null&&i.key)?i.key:e;else{const o=this._textWrapper.length-this._cursorOffset;this._textWrapper.removePart(o,o,e),this._textHasChanged()}}}_updateValueFromCursorIndex(t){if(this._blinkIsEven=!1,this._cursorIndex===-1)this._cursorIndex=t;else if(this._cursorIndex<this._cursorOffset)this._endHighlightIndex=this._textWrapper.length-this._cursorIndex,this._startHighlightIndex=this._textWrapper.length-this._cursorOffset;else if(this._cursorIndex>this._cursorOffset)this._endHighlightIndex=this._textWrapper.length-this._cursorOffset,this._startHighlightIndex=this._textWrapper.length-this._cursorIndex;else{this.isTextHighlightOn=!1,this._markAsDirty();return}this.isTextHighlightOn=!0,this._markAsDirty()}_processDblClick(t){this._startHighlightIndex=this._textWrapper.length-this._cursorOffset,this._endHighlightIndex=this._startHighlightIndex;let e,i;do i=this._endHighlightIndex<this._textWrapper.length&&this._textWrapper.isWord(this._endHighlightIndex)?++this._endHighlightIndex:0,e=this._startHighlightIndex>0&&this._textWrapper.isWord(this._startHighlightIndex-1)?--this._startHighlightIndex:0;while(e||i);this._cursorOffset=this._textWrapper.length-this._startHighlightIndex,this.isTextHighlightOn=!0,this._clickedCoordinate=null,this._blinkIsEven=!0,this._cursorIndex=-1,this._markAsDirty()}_selectAllText(){this._blinkIsEven=!0,this.isTextHighlightOn=!0,this._startHighlightIndex=0,this._endHighlightIndex=this._textWrapper.length,this._cursorOffset=this._textWrapper.length,this._cursorIndex=-1,this._markAsDirty()}processKeyboard(t){this.processKey(t.keyCode,t.key,t),this.onKeyboardEventProcessedObservable.notifyObservers(t)}_onCopyText(t){this.isTextHighlightOn=!1;try{t.clipboardData&&t.clipboardData.setData("text/plain",this._highlightedText)}catch{}this._host.clipboardData=this._highlightedText}_onCutText(t){if(this._highlightedText){this._textWrapper.removePart(this._startHighlightIndex,this._endHighlightIndex),this._textHasChanged(),this.isTextHighlightOn=!1,this._cursorOffset=this._textWrapper.length-this._startHighlightIndex;try{t.clipboardData&&t.clipboardData.setData("text/plain",this._highlightedText)}catch{}this._host.clipboardData=this._highlightedText,this._highlightedText=""}}_onPasteText(t){let e="";t.clipboardData&&t.clipboardData.types.indexOf("text/plain")!==-1?e=t.clipboardData.getData("text/plain"):e=this._host.clipboardData;const i=this._textWrapper.length-this._cursorOffset;this._textWrapper.removePart(i,i,e),this._textHasChanged()}_draw(t){t.save(),this._applyStates(t),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),this._isFocused?this._focusedBackground&&(t.fillStyle=this._isEnabled?this._focusedBackground:this._disabledColor,t.fillRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height)):this._background&&(t.fillStyle=this._isEnabled?this._background:this._disabledColor,t.fillRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height)),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),(!this._fontOffset||this._wasDirty)&&(this._fontOffset=c._GetFontOffset(t.font));const e=this._currentMeasure.left+this._margin.getValueInPixel(this._host,this._tempParentMeasure.width);this.color&&(t.fillStyle=this.color);let i=this._beforeRenderText(this._textWrapper);!this._isFocused&&!this._textWrapper.text&&this._placeholderText&&(i=new Ke,i.text=this._placeholderText,this._placeholderColor&&(t.fillStyle=this._placeholderColor)),this._textWidth=t.measureText(i.text).width;const s=this._margin.getValueInPixel(this._host,this._tempParentMeasure.width)*2;this._autoStretchWidth&&(this.width=Math.min(this._maxWidth.getValueInPixel(this._host,this._tempParentMeasure.width),this._textWidth+s)+"px",this._autoStretchWidth=!0);const o=this._fontOffset.ascent+(this._currentMeasure.height-this._fontOffset.height)/2,r=this._width.getValueInPixel(this._host,this._tempParentMeasure.width)-s;if(t.save(),t.beginPath(),t.rect(e,this._currentMeasure.top+(this._currentMeasure.height-this._fontOffset.height)/2,r+2,this._currentMeasure.height),t.clip(),this._isFocused&&this._textWidth>r){const a=e-this._textWidth+r;this._scrollLeft||(this._scrollLeft=a)}else this._scrollLeft=e;if(t.fillText(i.text,this._scrollLeft,this._currentMeasure.top+o),this._isFocused){if(this._clickedCoordinate){const l=this._scrollLeft+this._textWidth-this._clickedCoordinate;let h=0;this._cursorOffset=0;let f=0;do this._cursorOffset&&(f=Math.abs(l-h)),this._cursorOffset++,h=t.measureText(i.substr(i.length-this._cursorOffset,this._cursorOffset)).width;while(h<l&&i.length>=this._cursorOffset);Math.abs(l-h)>f&&this._cursorOffset--,this._blinkIsEven=!1,this._clickedCoordinate=null}if(!this._blinkIsEven){const a=i.substr(i.length-this._cursorOffset),l=t.measureText(a).width;let h=this._scrollLeft+this._textWidth-l;h<e?(this._scrollLeft+=e-h,h=e,this._markAsDirty()):h>e+r&&(this._scrollLeft+=e+r-h,h=e+r,this._markAsDirty()),this.isTextHighlightOn||t.fillRect(h,this._currentMeasure.top+(this._currentMeasure.height-this._fontOffset.height)/2,2,this._fontOffset.height)}if(clearTimeout(this._blinkTimeout),this._blinkTimeout=setTimeout(()=>{this._blinkIsEven=!this._blinkIsEven,this._markAsDirty()},500),this.isTextHighlightOn){clearTimeout(this._blinkTimeout);const a=t.measureText(i.substring(this._startHighlightIndex)).width;let l=this._scrollLeft+this._textWidth-a;this._highlightedText=i.substring(this._startHighlightIndex,this._endHighlightIndex);let h=t.measureText(i.substring(this._startHighlightIndex,this._endHighlightIndex)).width;l<e&&(h=h-(e-l),h||(h=t.measureText(i.charAt(i.length-this._cursorOffset)).width),l=e),t.globalAlpha=this._highligherOpacity,t.fillStyle=this._textHighlightColor,t.fillRect(l,this._currentMeasure.top+(this._currentMeasure.height-this._fontOffset.height)/2,h,this._fontOffset.height),t.globalAlpha=1}}t.restore(),this._thickness&&(this._isFocused?this.focusedColor&&(t.strokeStyle=this.focusedColor):this.color&&(t.strokeStyle=this.color),t.lineWidth=this._thickness,t.strokeRect(this._currentMeasure.left+this._thickness/2,this._currentMeasure.top+this._thickness/2,this._currentMeasure.width-this._thickness,this._currentMeasure.height-this._thickness)),t.restore()}_onPointerDown(t,e,i,s,o){return super._onPointerDown(t,e,i,s,o)?this.isReadOnly?!0:(this._clickedCoordinate=e.x,this.isTextHighlightOn=!1,this._highlightedText="",this._cursorIndex=-1,this._isPointerDown=!0,this._host._capturingControl[i]=this,this._focusedBy=o.event.pointerType,this._host.focusedControl===this?(clearTimeout(this._blinkTimeout),this._markAsDirty(),!0):this._isEnabled?(this._host.focusedControl=this,!0):!1):!1}_onPointerMove(t,e,i,s){this._host.focusedControl===this&&this._isPointerDown&&!this.isReadOnly&&(this._clickedCoordinate=e.x,this._markAsDirty(),this._updateValueFromCursorIndex(this._cursorOffset)),super._onPointerMove(t,e,i,s)}_onPointerUp(t,e,i,s,o){this._isPointerDown=!1,delete this._host._capturingControl[i],super._onPointerUp(t,e,i,s,o)}_beforeRenderText(t){return t}set isTextHighlightOn(t){this._isTextHighlightOn!==t&&(t&&this.onTextHighlightObservable.notifyObservers(this),this._isTextHighlightOn=t)}get isTextHighlightOn(){return this._isTextHighlightOn}dispose(){super.dispose(),this.onBlurObservable.clear(),this.onFocusObservable.clear(),this.onTextChangedObservable.clear(),this.onTextCopyObservable.clear(),this.onTextCutObservable.clear(),this.onTextPasteObservable.clear(),this.onTextHighlightObservable.clear(),this.onKeyboardEventProcessedObservable.clear()}}n([_()],z.prototype,"promptMessage",void 0);n([_()],z.prototype,"disableMobilePrompt",void 0);n([_()],z.prototype,"maxWidth",null);n([_()],z.prototype,"highligherOpacity",null);n([_()],z.prototype,"onFocusSelectAll",null);n([_()],z.prototype,"textHighlightColor",null);n([_()],z.prototype,"margin",null);n([_()],z.prototype,"autoStretchWidth",null);n([_()],z.prototype,"thickness",null);n([_()],z.prototype,"focusedBackground",null);n([_()],z.prototype,"focusedColor",null);n([_()],z.prototype,"background",null);n([_()],z.prototype,"placeholderColor",null);n([_()],z.prototype,"placeholderText",null);n([_()],z.prototype,"deadKey",null);n([_()],z.prototype,"text",null);n([_()],z.prototype,"width",null);F("BABYLON.GUI.InputText",z);class dt extends ht{set clipContent(t){this._clipContent=t;for(const e in this._cells)this._cells[e].clipContent=t}get clipContent(){return this._clipContent}set clipChildren(t){this._clipChildren=t;for(const e in this._cells)this._cells[e].clipChildren=t}get clipChildren(){return this._clipChildren}get columnCount(){return this._columnDefinitions.length}get rowCount(){return this._rowDefinitions.length}get children(){return this._childControls}get cells(){return this._cells}getRowDefinition(t){return t<0||t>=this._rowDefinitions.length?null:this._rowDefinitions[t]}getColumnDefinition(t){return t<0||t>=this._columnDefinitions.length?null:this._columnDefinitions[t]}addRowDefinition(t,e=!1){return this._rowDefinitions.push(new p(t,e?p.UNITMODE_PIXEL:p.UNITMODE_PERCENTAGE)),this._rowDefinitionObservers.push(this._rowDefinitions[this.rowCount-1].onChangedObservable.add(()=>this._markAsDirty())),this._markAsDirty(),this}addColumnDefinition(t,e=!1){return this._columnDefinitions.push(new p(t,e?p.UNITMODE_PIXEL:p.UNITMODE_PERCENTAGE)),this._columnDefinitionObservers.push(this._columnDefinitions[this.columnCount-1].onChangedObservable.add(()=>this._markAsDirty())),this._markAsDirty(),this}setRowDefinition(t,e,i=!1){if(t<0||t>=this._rowDefinitions.length)return this;const s=this._rowDefinitions[t];return s&&s.isPixel===i&&s.value===e?this:(this._rowDefinitions[t].onChangedObservable.remove(this._rowDefinitionObservers[t]),this._rowDefinitions[t]=new p(e,i?p.UNITMODE_PIXEL:p.UNITMODE_PERCENTAGE),this._rowDefinitionObservers[t]=this._rowDefinitions[t].onChangedObservable.add(()=>this._markAsDirty()),this._markAsDirty(),this)}setColumnDefinition(t,e,i=!1){if(t<0||t>=this._columnDefinitions.length)return this;const s=this._columnDefinitions[t];return s&&s.isPixel===i&&s.value===e?this:(this._columnDefinitions[t].onChangedObservable.remove(this._columnDefinitionObservers[t]),this._columnDefinitions[t]=new p(e,i?p.UNITMODE_PIXEL:p.UNITMODE_PERCENTAGE),this._columnDefinitionObservers[t]=this._columnDefinitions[t].onChangedObservable.add(()=>this._markAsDirty()),this._markAsDirty(),this)}getChildrenAt(t,e){const i=this._cells[`${t}:${e}`];return i?i.children:null}getChildCellInfo(t){return t._tag}_removeCell(t,e){if(t){super.removeControl(t);for(const i of t.children){const s=this._childControls.indexOf(i);s!==-1&&this._childControls.splice(s,1)}delete this._cells[e]}}_offsetCell(t,e){if(this._cells[e]){this._cells[t]=this._cells[e];for(const i of this._cells[t].children)i._tag=t;delete this._cells[e]}}removeColumnDefinition(t){if(t<0||t>=this._columnDefinitions.length)return this;for(let e=0;e<this._rowDefinitions.length;e++){const i=`${e}:${t}`,s=this._cells[i];this._removeCell(s,i)}for(let e=0;e<this._rowDefinitions.length;e++)for(let i=t+1;i<this._columnDefinitions.length;i++){const s=`${e}:${i-1}`,o=`${e}:${i}`;this._offsetCell(s,o)}return this._columnDefinitions[t].onChangedObservable.remove(this._columnDefinitionObservers[t]),this._columnDefinitions.splice(t,1),this._columnDefinitionObservers.splice(t,1),this._markAsDirty(),this}removeRowDefinition(t){if(t<0||t>=this._rowDefinitions.length)return this;for(let e=0;e<this._columnDefinitions.length;e++){const i=`${t}:${e}`,s=this._cells[i];this._removeCell(s,i)}for(let e=0;e<this._columnDefinitions.length;e++)for(let i=t+1;i<this._rowDefinitions.length;i++){const s=`${i-1}:${e}`,o=`${i}:${e}`;this._offsetCell(s,o)}return this._rowDefinitions[t].onChangedObservable.remove(this._rowDefinitionObservers[t]),this._rowDefinitions.splice(t,1),this._rowDefinitionObservers.splice(t,1),this._markAsDirty(),this}addControl(t,e=0,i=0){if(this._rowDefinitions.length===0&&this.addRowDefinition(1,!1),this._columnDefinitions.length===0&&this.addColumnDefinition(1,!1),this._childControls.indexOf(t)!==-1)return gt.Warn(`Control (Name:${t.name}, UniqueId:${t.uniqueId}) is already associated with this grid. You must remove it before reattaching it`),this;const s=Math.min(e,this._rowDefinitions.length-1),o=Math.min(i,this._columnDefinitions.length-1),r=`${s}:${o}`;let a=this._cells[r];return a||(a=new ht(r),this._cells[r]=a,a.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,a.verticalAlignment=c.VERTICAL_ALIGNMENT_TOP,a.clipContent=this.clipContent,a.clipChildren=this.clipChildren,super.addControl(a)),a.addControl(t),this._childControls.push(t),t._tag=r,t.parent=this,this._markAsDirty(),this}removeControl(t){const e=this._childControls.indexOf(t);e!==-1&&this._childControls.splice(e,1);const i=this._cells[t._tag];return i&&(i.removeControl(t),t._tag=null),this._markAsDirty(),this}constructor(t){super(t),this.name=t,this._rowDefinitions=new Array,this._rowDefinitionObservers=[],this._columnDefinitions=new Array,this._columnDefinitionObservers=[],this._cells={},this._childControls=new Array}_getTypeName(){return"Grid"}_getGridDefinitions(t){const e=[],i=[],s=[],o=[];let r=this._currentMeasure.width,a=0,l=this._currentMeasure.height,h=0,f=0;for(const I of this._rowDefinitions){if(I.isPixel){const k=I.getValue(this._host);l-=k,i[f]=k}else h+=I.value;f++}let d=0;f=0;for(const I of this._rowDefinitions){if(o.push(d),I.isPixel)d+=I.getValue(this._host);else{const k=Math.round(I.value/h*l);d+=k,i[f]=k}f++}f=0;for(const I of this._columnDefinitions){if(I.isPixel){const k=I.getValue(this._host);r-=k,e[f]=k}else a+=I.value;f++}let u=0;f=0;for(const I of this._columnDefinitions){if(s.push(u),I.isPixel)u+=I.getValue(this._host);else{const k=Math.round(I.value/a*r);u+=k,e[f]=k}f++}t(s,o,e,i)}_additionalProcessing(t,e){this._getGridDefinitions((i,s,o,r)=>{for(const a in this._cells){if(!Object.prototype.hasOwnProperty.call(this._cells,a))continue;const l=a.split(":"),h=parseInt(l[0]),f=parseInt(l[1]),d=this._cells[a];d.leftInPixels=i[f],d.topInPixels=s[h],d.widthInPixels=o[f],d.heightInPixels=r[h],d._left.ignoreAdaptiveScaling=!0,d._top.ignoreAdaptiveScaling=!0,d._width.ignoreAdaptiveScaling=!0,d._height.ignoreAdaptiveScaling=!0}}),super._additionalProcessing(t,e)}_flagDescendantsAsMatrixDirty(){for(const t in this._cells){if(!Object.prototype.hasOwnProperty.call(this._cells,t))continue;this._cells[t]._markMatrixAsDirty()}}_renderHighlightSpecific(t){super._renderHighlightSpecific(t),this._getGridDefinitions((e,i,s,o)=>{for(let r=0;r<e.length;r++){const a=this._currentMeasure.left+e[r]+s[r];t.beginPath(),t.moveTo(a,this._currentMeasure.top),t.lineTo(a,this._currentMeasure.top+this._currentMeasure.height),t.stroke()}for(let r=0;r<i.length;r++){const a=this._currentMeasure.top+i[r]+o[r];t.beginPath(),t.moveTo(this._currentMeasure.left,a),t.lineTo(this._currentMeasure.left+this._currentMeasure.width,a),t.stroke()}}),t.restore()}dispose(){super.dispose();for(const t of this._childControls)t.dispose();for(let t=0;t<this._rowDefinitions.length;t++)this._rowDefinitions[t].onChangedObservable.remove(this._rowDefinitionObservers[t]);for(let t=0;t<this._columnDefinitions.length;t++)this._columnDefinitions[t].onChangedObservable.remove(this._columnDefinitionObservers[t]);this._rowDefinitionObservers.length=0,this._rowDefinitions.length=0,this._columnDefinitionObservers.length=0,this._columnDefinitions.length=0,this._cells={},this._childControls.length=0}serialize(t){super.serialize(t),t.columnCount=this.columnCount,t.rowCount=this.rowCount,t.columns=[],t.rows=[],t.tags=[];for(let e=0;e<this.columnCount;++e){const i=this.getColumnDefinition(e),s={value:i==null?void 0:i.getValue(this.host),unit:i==null?void 0:i.unit};t.columns.push(s)}for(let e=0;e<this.rowCount;++e){const i=this.getRowDefinition(e),s={value:i==null?void 0:i.getValue(this.host),unit:i==null?void 0:i.unit};t.rows.push(s)}this.children.forEach(e=>{t.tags.push(e._tag)})}_parseFromContent(t,e){super._parseFromContent(t,e);const i=[];this.children.forEach(s=>{i.push(s)}),this.removeRowDefinition(0),this.removeColumnDefinition(0);for(let s=0;s<t.columnCount;++s){const o=t.columns[s].value,r=t.columns[s].unit;this.addColumnDefinition(o,r===1)}for(let s=0;s<t.rowCount;++s){const o=t.rows[s].value,r=t.rows[s].unit;this.addRowDefinition(o,r===1)}for(let s=0;s<i.length;++s){const o=t.tags[s];let r=parseInt(o.substring(0,o.search(":")));isNaN(r)&&(r=0);let a=parseInt(o.substring(o.search(":")+1));isNaN(a)&&(a=0),this.addControl(i[s],r,a)}}}n([_()],dt.prototype,"clipContent",null);F("BABYLON.GUI.Grid",dt);class ut extends c{get value(){return this._value}set value(t){this._value.equals(t)||(this._value.copyFrom(t),this._value.toHSVToRef(this._tmpColor),this._h=this._tmpColor.r,this._s=Math.max(this._tmpColor.g,1e-5),this._v=Math.max(this._tmpColor.b,1e-5),this._markAsDirty(),this._value.r<=ut._Epsilon&&(this._value.r=0),this._value.g<=ut._Epsilon&&(this._value.g=0),this._value.b<=ut._Epsilon&&(this._value.b=0),this._value.r>=1-ut._Epsilon&&(this._value.r=1),this._value.g>=1-ut._Epsilon&&(this._value.g=1),this._value.b>=1-ut._Epsilon&&(this._value.b=1),this.onValueChangedObservable.notifyObservers(this._value))}get width(){return this._width.toString(this._host)}set width(t){this._width.toString(this._host)!==t&&this._width.fromString(t)&&(this._width.getValue(this._host)===0&&(t="1px",this._width.fromString(t)),this._height.fromString(t),this._markAsDirty())}get height(){return this._height.toString(this._host)}set height(t){this._height.toString(this._host)!==t&&this._height.fromString(t)&&(this._height.getValue(this._host)===0&&(t="1px",this._height.fromString(t)),this._width.fromString(t),this._markAsDirty())}get size(){return this.width}set size(t){this.width=t}constructor(t){super(t),this.name=t,this._value=V.Red(),this._tmpColor=new V,this._pointerStartedOnSquare=!1,this._pointerStartedOnWheel=!1,this._squareLeft=0,this._squareTop=0,this._squareSize=0,this._h=360,this._s=1,this._v=1,this._lastPointerDownId=-1,this.onValueChangedObservable=new T,this._pointerIsDown=!1,this.value=new V(.88,.1,.1),this.size="200px",this.isPointerBlocker=!0}_getTypeName(){return"ColorPicker"}_preMeasure(t){t.width<t.height?this._currentMeasure.height=t.width:this._currentMeasure.width=t.height}_updateSquareProps(){const t=Math.min(this._currentMeasure.width,this._currentMeasure.height)*.5,e=t*.2,s=(t-e)*2/Math.sqrt(2),o=t-s*.5;this._squareLeft=this._currentMeasure.left+o,this._squareTop=this._currentMeasure.top+o,this._squareSize=s}_drawGradientSquare(t,e,i,s,o,r){const a=r.createLinearGradient(e,i,s+e,i);a.addColorStop(0,"#fff"),a.addColorStop(1,"hsl("+t+", 100%, 50%)"),r.fillStyle=a,r.fillRect(e,i,s,o);const l=r.createLinearGradient(e,i,e,o+i);l.addColorStop(0,"rgba(0,0,0,0)"),l.addColorStop(1,"#000"),r.fillStyle=l,r.fillRect(e,i,s,o)}_drawCircle(t,e,i,s){s.beginPath(),s.arc(t,e,i+1,0,2*Math.PI,!1),s.lineWidth=3,s.strokeStyle="#333333",s.stroke(),s.beginPath(),s.arc(t,e,i,0,2*Math.PI,!1),s.lineWidth=3,s.strokeStyle="#ffffff",s.stroke()}_createColorWheelCanvas(t,e){const i=ne.LastCreatedEngine;if(!i)throw new Error("Invalid engine. Unable to create a canvas.");const s=i.createCanvas(t*2,t*2),o=s.getContext("2d"),r=o.getImageData(0,0,t*2,t*2),a=r.data,l=this._tmpColor,h=t*t,f=t-e,d=f*f;for(let u=-t;u<t;u++)for(let I=-t;I<t;I++){const k=u*u+I*I;if(k>h||k<d)continue;const It=Math.sqrt(k),Ie=Math.atan2(I,u);V.HSVtoRGBToRef(Ie*180/Math.PI+180,It/t,1,l);const wt=(u+t+(I+t)*2*t)*4;a[wt]=l.r*255,a[wt+1]=l.g*255,a[wt+2]=l.b*255;let Mt=(It-f)/(t-f),Ft=.2;const ye=.2,Re=.04,ot=50,N=150;t<ot?Ft=ye:t>N?Ft=Re:Ft=(Re-ye)*(t-ot)/(N-ot)+ye,Mt=(It-f)/(t-f),Mt<Ft?a[wt+3]=255*(Mt/Ft):Mt>1-Ft?a[wt+3]=255*(1-(Mt-(1-Ft))/Ft):a[wt+3]=255}return o.putImageData(r,0,0),s}_draw(t){t.save(),this._applyStates(t);const e=Math.min(this._currentMeasure.width,this._currentMeasure.height)*.5,i=e*.2,s=this._currentMeasure.left,o=this._currentMeasure.top;(!this._colorWheelCanvas||this._colorWheelCanvas.width!=e*2)&&(this._colorWheelCanvas=this._createColorWheelCanvas(e,i)),this._updateSquareProps(),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY,t.fillRect(this._squareLeft,this._squareTop,this._squareSize,this._squareSize)),t.drawImage(this._colorWheelCanvas,s,o),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),this._drawGradientSquare(this._h,this._squareLeft,this._squareTop,this._squareSize,this._squareSize,t);let r=this._squareLeft+this._squareSize*this._s,a=this._squareTop+this._squareSize*(1-this._v);this._drawCircle(r,a,e*.04,t);const l=e-i*.5;r=s+e+Math.cos((this._h-180)*Math.PI/180)*l,a=o+e+Math.sin((this._h-180)*Math.PI/180)*l,this._drawCircle(r,a,i*.35,t),t.restore()}_updateValueFromPointer(t,e){if(this._pointerStartedOnWheel){const i=Math.min(this._currentMeasure.width,this._currentMeasure.height)*.5,s=i+this._currentMeasure.left,o=i+this._currentMeasure.top;this._h=Math.atan2(e-o,t-s)*180/Math.PI+180}else this._pointerStartedOnSquare&&(this._updateSquareProps(),this._s=(t-this._squareLeft)/this._squareSize,this._v=1-(e-this._squareTop)/this._squareSize,this._s=Math.min(this._s,1),this._s=Math.max(this._s,ut._Epsilon),this._v=Math.min(this._v,1),this._v=Math.max(this._v,ut._Epsilon));V.HSVtoRGBToRef(this._h,this._s,this._v,this._tmpColor),this.value=this._tmpColor}_isPointOnSquare(t,e){this._updateSquareProps();const i=this._squareLeft,s=this._squareTop,o=this._squareSize;return t>=i&&t<=i+o&&e>=s&&e<=s+o}_isPointOnWheel(t,e){const i=Math.min(this._currentMeasure.width,this._currentMeasure.height)*.5,s=i+this._currentMeasure.left,o=i+this._currentMeasure.top,r=i*.2,a=i-r,l=i*i,h=a*a,f=t-s,d=e-o,u=f*f+d*d;return u<=l&&u>=h}_onPointerDown(t,e,i,s,o){if(!super._onPointerDown(t,e,i,s,o))return!1;if(this.isReadOnly)return!0;this._pointerIsDown=!0,this._pointerStartedOnSquare=!1,this._pointerStartedOnWheel=!1,this._invertTransformMatrix.transformCoordinates(e.x,e.y,this._transformedPosition);const r=this._transformedPosition.x,a=this._transformedPosition.y;return this._isPointOnSquare(r,a)?this._pointerStartedOnSquare=!0:this._isPointOnWheel(r,a)&&(this._pointerStartedOnWheel=!0),this._updateValueFromPointer(r,a),this._host._capturingControl[i]=this,this._lastPointerDownId=i,!0}_onPointerMove(t,e,i,s){if(i==this._lastPointerDownId){if(!this.isReadOnly){this._invertTransformMatrix.transformCoordinates(e.x,e.y,this._transformedPosition);const o=this._transformedPosition.x,r=this._transformedPosition.y;this._pointerIsDown&&this._updateValueFromPointer(o,r)}super._onPointerMove(t,e,i,s)}}_onPointerUp(t,e,i,s,o,r){this._pointerIsDown=!1,delete this._host._capturingControl[i],super._onPointerUp(t,e,i,s,o,r)}_onCanvasBlur(){this._forcePointerUp(),super._onCanvasBlur()}static ShowPickerDialogAsync(t,e){return new Promise(i=>{e.pickerWidth=e.pickerWidth||"640px",e.pickerHeight=e.pickerHeight||"400px",e.headerHeight=e.headerHeight||"35px",e.lastColor=e.lastColor||"#000000",e.swatchLimit=e.swatchLimit||20,e.numSwatchesPerLine=e.numSwatchesPerLine||10;const s=e.swatchLimit/e.numSwatchesPerLine,o=parseFloat(e.pickerWidth)/e.numSwatchesPerLine,r=Math.floor(o*.25),a=r*(e.numSwatchesPerLine+1),l=Math.floor((parseFloat(e.pickerWidth)-a)/e.numSwatchesPerLine),h=l*s+r*(s+1),f=(parseInt(e.pickerHeight)+h+Math.floor(l*.25)).toString()+"px",d="#c0c0c0",u="#535353",I="#414141",k="515151",It="#555555",Ie="#454545",wt="#404040",Mt=V.FromHexString("#dddddd"),Ft=Mt.r+Mt.g+Mt.b,ye="#aaaaaa",Re="#ffffff";let ot,N;const Ze=["R","G","B"],jt="#454545",$t="#f0f0f0";let Jt,G,Ht=!1,Y,mt,S;const Ct=new dt;if(Ct.name="Dialog Container",Ct.width=e.pickerWidth,e.savedColors){Ct.height=f;const g=parseInt(e.pickerHeight)/parseInt(f);Ct.addRowDefinition(g,!1),Ct.addRowDefinition(1-g,!1)}else Ct.height=e.pickerHeight,Ct.addRowDefinition(1,!1);if(t.addControl(Ct),e.savedColors){G=new dt,G.name="Swatch Drawer",G.verticalAlignment=c.VERTICAL_ALIGNMENT_TOP,G.background=u,G.width=e.pickerWidth;const g=e.savedColors.length/e.numSwatchesPerLine;let C;g==0?C=0:C=g+1,G.height=(l*g+C*r).toString()+"px",G.top=Math.floor(l*.25).toString()+"px";for(let m=0;m<Math.ceil(e.savedColors.length/e.numSwatchesPerLine)*2+1;m++)m%2!=0?G.addRowDefinition(l,!0):G.addRowDefinition(r,!0);for(let m=0;m<e.numSwatchesPerLine*2+1;m++)m%2!=0?G.addColumnDefinition(l,!0):G.addColumnDefinition(r,!0);Ct.addControl(G,1,0)}const Gt=new dt;Gt.name="Picker Panel",Gt.height=e.pickerHeight;const je=parseInt(e.headerHeight)/parseInt(e.pickerHeight),Pe=[je,1-je];Gt.addRowDefinition(Pe[0],!1),Gt.addRowDefinition(Pe[1],!1),Ct.addControl(Gt,0,0);const kt=new Bt;kt.name="Dialogue Header Bar",kt.background="#cccccc",kt.thickness=0,Gt.addControl(kt,0,0);const it=Qt.CreateSimpleButton("closeButton","a");it.fontFamily="coreglyphs";const Ae=V.FromHexString(kt.background),$e=new V(1-Ae.r,1-Ae.g,1-Ae.b);it.color=$e.toHexString(),it.fontSize=Math.floor(parseInt(e.headerHeight)*.6),it.textBlock.textVerticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,it.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_RIGHT,it.height=it.width=e.headerHeight,it.background=kt.background,it.thickness=0,it.pointerDownAnimation=()=>{},it.pointerUpAnimation=()=>{it.background=kt.background},it.pointerEnterAnimation=()=>{it.color=kt.background,it.background="red"},it.pointerOutAnimation=()=>{it.color=$e.toHexString(),it.background=kt.background},it.onPointerClickObservable.add(()=>{He(yt.background)}),Gt.addControl(it,0,0);const Ut=new dt;Ut.name="Dialogue Body",Ut.background=u;const we=[.4375,.5625];Ut.addRowDefinition(1,!1),Ut.addColumnDefinition(we[0],!1),Ut.addColumnDefinition(we[1],!1),Gt.addControl(Ut,1,0);const te=new dt;te.name="Picker Grid",te.addRowDefinition(.85,!1),te.addRowDefinition(.15,!1),Ut.addControl(te,0,0);const bt=new ut;bt.name="GUI Color Picker",e.pickerHeight<e.pickerWidth?bt.width=.89:bt.height=.89,bt.value=V.FromHexString(e.lastColor),bt.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_CENTER,bt.verticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,bt.onPointerDownObservable.add(()=>{S=bt.name,mt="",pt(!1)}),bt.onValueChangedObservable.add(function(g){S==bt.name&&Tt(g,bt.name)}),te.addControl(bt,0,0);const ee=new dt;ee.name="Dialogue Right Half",ee.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT;const Fe=[.514,.486];ee.addRowDefinition(Fe[0],!1),ee.addRowDefinition(Fe[1],!1),Ut.addControl(ee,1,1);const ie=new dt;ie.name="Swatches and Buttons";const Ee=[.417,.583];ie.addRowDefinition(1,!1),ie.addColumnDefinition(Ee[0],!1),ie.addColumnDefinition(Ee[1],!1),ee.addControl(ie,0,0);const Et=new dt;Et.name="New and Current Swatches";const Be=[.04,.16,.64,.16];Et.addRowDefinition(Be[0],!1),Et.addRowDefinition(Be[1],!1),Et.addRowDefinition(Be[2],!1),Et.addRowDefinition(Be[3],!1),ie.addControl(Et,0,0);const se=new dt;se.name="Active Swatches",se.width=.67,se.addRowDefinition(.5,!1),se.addRowDefinition(.5,!1),Et.addControl(se,2,0);const fi=Math.floor(parseInt(e.pickerWidth)*we[1]*Ee[0]*.11),ui=Math.floor(parseInt(e.pickerHeight)*Pe[1]*Fe[0]*Be[1]*.5);let Oe;e.pickerWidth>e.pickerHeight?Oe=ui:Oe=fi;const Ce=new U;Ce.text="new",Ce.name="New Color Label",Ce.color=d,Ce.fontSize=Oe,Et.addControl(Ce,1,0);const At=new Bt;At.name="New Color Swatch",At.background=e.lastColor,At.thickness=0,se.addControl(At,0,0);const yt=Qt.CreateSimpleButton("currentSwatch","");yt.background=e.lastColor,yt.thickness=0,yt.onPointerClickObservable.add(()=>{const g=V.FromHexString(yt.background);Tt(g,yt.name),pt(!1)}),yt.pointerDownAnimation=()=>{},yt.pointerUpAnimation=()=>{},yt.pointerEnterAnimation=()=>{},yt.pointerOutAnimation=()=>{},se.addControl(yt,1,0);const he=new Bt;he.name="Swatch Outline",he.width=.67,he.thickness=2,he.color=wt,he.isHitTestVisible=!1,Et.addControl(he,2,0);const Te=new U;Te.name="Current Color Label",Te.text="current",Te.color=d,Te.fontSize=Oe,Et.addControl(Te,3,0);const Ot=new dt;Ot.name="Button Grid",Ot.height=.8;const Le=1/3;Ot.addRowDefinition(Le,!1),Ot.addRowDefinition(Le,!1),Ot.addRowDefinition(Le,!1),ie.addControl(Ot,0,1);const oe=Math.floor(parseInt(e.pickerWidth)*we[1]*Ee[1]*.67).toString()+"px",ce=Math.floor(parseInt(e.pickerHeight)*Pe[1]*Fe[0]*(parseFloat(Ot.height.toString())/100)*Le*.7).toString()+"px";parseFloat(oe)>parseFloat(ce)?ot=Math.floor(parseFloat(ce)*.45):ot=Math.floor(parseFloat(oe)*.11);const at=Qt.CreateSimpleButton("butOK","OK");at.width=oe,at.height=ce,at.verticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,at.thickness=2,at.color=d,at.fontSize=ot,at.background=u,at.onPointerEnterObservable.add(()=>{at.background=I}),at.onPointerOutObservable.add(()=>{at.background=u}),at.pointerDownAnimation=()=>{at.background=k},at.pointerUpAnimation=()=>{at.background=I},at.onPointerClickObservable.add(()=>{pt(!1),He(At.background)}),Ot.addControl(at,0,0);const _t=Qt.CreateSimpleButton("butCancel","Cancel");_t.width=oe,_t.height=ce,_t.verticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,_t.thickness=2,_t.color=d,_t.fontSize=ot,_t.background=u,_t.onPointerEnterObservable.add(()=>{_t.background=I}),_t.onPointerOutObservable.add(()=>{_t.background=u}),_t.pointerDownAnimation=()=>{_t.background=k},_t.pointerUpAnimation=()=>{_t.background=I},_t.onPointerClickObservable.add(()=>{pt(!1),He(yt.background)}),Ot.addControl(_t,1,0),e.savedColors&&(Y=Qt.CreateSimpleButton("butSave","Save"),Y.width=oe,Y.height=ce,Y.verticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,Y.thickness=2,Y.fontSize=ot,e.savedColors.length<e.swatchLimit?(Y.color=d,Y.background=u):We(Y,!0),Y.onPointerEnterObservable.add(()=>{e.savedColors&&e.savedColors.length<e.swatchLimit&&(Y.background=I)}),Y.onPointerOutObservable.add(()=>{e.savedColors&&e.savedColors.length<e.swatchLimit&&(Y.background=u)}),Y.pointerDownAnimation=()=>{e.savedColors&&e.savedColors.length<e.swatchLimit&&(Y.background=k)},Y.pointerUpAnimation=()=>{e.savedColors&&e.savedColors.length<e.swatchLimit&&(Y.background=I)},Y.onPointerClickObservable.add(()=>{e.savedColors&&(e.savedColors.length==0&&ze(!0),e.savedColors.length<e.swatchLimit&&Ve(At.background,Y),pt(!1))}),e.savedColors.length>0&&ze(!0),Ot.addControl(Y,2,0));const Yt=new dt;Yt.name="Dialog Lower Right",Yt.addRowDefinition(.02,!1),Yt.addRowDefinition(.63,!1),Yt.addRowDefinition(.21,!1),Yt.addRowDefinition(.14,!1),ee.addControl(Yt,1,0);const de=V.FromHexString(e.lastColor),lt=new dt;lt.name="RGB Values",lt.width=.82,lt.verticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,lt.addRowDefinition(1/3,!1),lt.addRowDefinition(1/3,!1),lt.addRowDefinition(1/3,!1),lt.addColumnDefinition(.1,!1),lt.addColumnDefinition(.2,!1),lt.addColumnDefinition(.7,!1),Yt.addControl(lt,1,0);for(let g=0;g<Ze.length;g++){const C=new U;C.text=Ze[g],C.color=d,C.fontSize=ot,lt.addControl(C,g,0)}const $=new z;$.width=.83,$.height=.72,$.name="rIntField",$.fontSize=ot,$.text=(de.r*255).toString(),$.color=$t,$.background=jt,$.onFocusObservable.add(()=>{S=$.name,mt=$.text,pt(!1)}),$.onBlurObservable.add(()=>{$.text==""&&($.text="0"),fe($,"r"),S==$.name&&(S="")}),$.onTextChangedObservable.add(()=>{S==$.name&&fe($,"r")}),lt.addControl($,0,1);const J=new z;J.width=.83,J.height=.72,J.name="gIntField",J.fontSize=ot,J.text=(de.g*255).toString(),J.color=$t,J.background=jt,J.onFocusObservable.add(()=>{S=J.name,mt=J.text,pt(!1)}),J.onBlurObservable.add(()=>{J.text==""&&(J.text="0"),fe(J,"g"),S==J.name&&(S="")}),J.onTextChangedObservable.add(()=>{S==J.name&&fe(J,"g")}),lt.addControl(J,1,1);const tt=new z;tt.width=.83,tt.height=.72,tt.name="bIntField",tt.fontSize=ot,tt.text=(de.b*255).toString(),tt.color=$t,tt.background=jt,tt.onFocusObservable.add(()=>{S=tt.name,mt=tt.text,pt(!1)}),tt.onBlurObservable.add(()=>{tt.text==""&&(tt.text="0"),fe(tt,"b"),S==tt.name&&(S="")}),tt.onTextChangedObservable.add(()=>{S==tt.name&&fe(tt,"b")}),lt.addControl(tt,2,1);const X=new z;X.width=.95,X.height=.72,X.name="rDecField",X.fontSize=ot,X.text=de.r.toString(),X.color=$t,X.background=jt,X.onFocusObservable.add(()=>{S=X.name,mt=X.text,pt(!1)}),X.onBlurObservable.add(()=>{(parseFloat(X.text)==0||X.text=="")&&(X.text="0",ue(X,"r")),S==X.name&&(S="")}),X.onTextChangedObservable.add(()=>{S==X.name&&ue(X,"r")}),lt.addControl(X,0,2);const K=new z;K.width=.95,K.height=.72,K.name="gDecField",K.fontSize=ot,K.text=de.g.toString(),K.color=$t,K.background=jt,K.onFocusObservable.add(()=>{S=K.name,mt=K.text,pt(!1)}),K.onBlurObservable.add(()=>{(parseFloat(K.text)==0||K.text=="")&&(K.text="0",ue(K,"g")),S==K.name&&(S="")}),K.onTextChangedObservable.add(()=>{S==K.name&&ue(K,"g")}),lt.addControl(K,1,2);const q=new z;q.width=.95,q.height=.72,q.name="bDecField",q.fontSize=ot,q.text=de.b.toString(),q.color=$t,q.background=jt,q.onFocusObservable.add(()=>{S=q.name,mt=q.text,pt(!1)}),q.onBlurObservable.add(()=>{(parseFloat(q.text)==0||q.text=="")&&(q.text="0",ue(q,"b")),S==q.name&&(S="")}),q.onTextChangedObservable.add(()=>{S==q.name&&ue(q,"b")}),lt.addControl(q,2,2);const Xt=new dt;Xt.name="Hex Value",Xt.width=.82,Xt.addRowDefinition(1,!1),Xt.addColumnDefinition(.1,!1),Xt.addColumnDefinition(.9,!1),Yt.addControl(Xt,2,0);const De=new U;De.text="#",De.color=d,De.fontSize=ot,Xt.addControl(De,0,0);const E=new z;E.width=.96,E.height=.72,E.name="hexField",E.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_CENTER,E.fontSize=ot;const gi=e.lastColor.split("#");E.text=gi[1],E.color=$t,E.background=jt,E.onFocusObservable.add(()=>{S=E.name,mt=E.text,pt(!1)}),E.onBlurObservable.add(()=>{if(E.text.length==3){const g=E.text.split("");E.text=g[0]+g[0]+g[1]+g[1]+g[2]+g[2]}E.text==""&&(E.text="000000",Tt(V.FromHexString(E.text),"b")),S==E.name&&(S="")}),E.onTextChangedObservable.add(()=>{let g=E.text;const C=/[^0-9A-F]/i.test(g);if((E.text.length>6||C)&&S==E.name)E.text=mt;else{if(E.text.length<6){const m=6-E.text.length;for(let vt=0;vt<m;vt++)g="0"+g}if(E.text.length==3){const m=E.text.split("");g=m[0]+m[0]+m[1]+m[1]+m[2]+m[2]}g="#"+g,S==E.name&&(mt=E.text,Tt(V.FromHexString(g),E.name))}}),Xt.addControl(E,0,1),e.savedColors&&e.savedColors.length>0&&Ve("",Y);function Tt(g,C){S=C;const m=g.toHexString();if(At.background=m,$.name!=S&&($.text=Math.floor(g.r*255).toString()),J.name!=S&&(J.text=Math.floor(g.g*255).toString()),tt.name!=S&&(tt.text=Math.floor(g.b*255).toString()),X.name!=S&&(X.text=g.r.toString()),K.name!=S&&(K.text=g.g.toString()),q.name!=S&&(q.text=g.b.toString()),E.name!=S){const vt=m.split("#");E.text=vt[1]}bt.name!=S&&(bt.value=g)}function fe(g,C){let m=g.text;if(/[^0-9]/g.test(m)){g.text=mt;return}else m!=""&&(Math.floor(parseInt(m))<0?m="0":Math.floor(parseInt(m))>255?m="255":isNaN(parseInt(m))&&(m="0")),S==g.name&&(mt=m);if(m!=""){m=parseInt(m).toString(),g.text=m;const Z=V.FromHexString(At.background);S==g.name&&(C=="r"?Tt(new V(parseInt(m)/255,Z.g,Z.b),g.name):C=="g"?Tt(new V(Z.r,parseInt(m)/255,Z.b),g.name):Tt(new V(Z.r,Z.g,parseInt(m)/255),g.name))}}function ue(g,C){let m=g.text;if(/[^0-9.]/g.test(m)){g.text=mt;return}else m!=""&&m!="."&&parseFloat(m)!=0&&(parseFloat(m)<0?m="0.0":parseFloat(m)>1?m="1.0":isNaN(parseFloat(m))&&(m="0.0")),S==g.name&&(mt=m);m!=""&&m!="."&&parseFloat(m)!=0?(m=parseFloat(m).toString(),g.text=m):m="0.0";const Z=V.FromHexString(At.background);S==g.name&&(C=="r"?Tt(new V(parseFloat(m),Z.g,Z.b),g.name):C=="g"?Tt(new V(Z.r,parseFloat(m),Z.b),g.name):Tt(new V(Z.r,Z.g,parseFloat(m)),g.name))}function mi(g){e.savedColors&&e.savedColors.splice(g,1),e.savedColors&&e.savedColors.length==0&&(ze(!1),Ht=!1)}function bi(){if(e.savedColors&&e.savedColors[Jt]){let g;Ht?g="b":g="";const C=Qt.CreateSimpleButton("Swatch_"+Jt,g);C.fontFamily="coreglyphs";const m=V.FromHexString(e.savedColors[Jt]);m.r+m.g+m.b>Ft?C.color=ye:C.color=Re,C.fontSize=Math.floor(l*.7),C.textBlock.verticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,C.height=C.width=l.toString()+"px",C.background=e.savedColors[Jt],C.thickness=2;const Z=Jt;return C.pointerDownAnimation=()=>{C.thickness=4},C.pointerUpAnimation=()=>{C.thickness=3},C.pointerEnterAnimation=()=>{C.thickness=3},C.pointerOutAnimation=()=>{C.thickness=2},C.onPointerClickObservable.add(()=>{Ht?(mi(Z),Ve("",Y)):e.savedColors&&Tt(V.FromHexString(e.savedColors[Z]),C.name)}),C}else return null}function pt(g){g!==void 0&&(Ht=g);let C;if(Ht){for(let m=0;m<G.children.length;m++)C=G.children[m],C.textBlock.text="b";N!==void 0&&(N.textBlock.text="Done")}else{for(let m=0;m<G.children.length;m++)C=G.children[m],C.textBlock.text="";N!==void 0&&(N.textBlock.text="Edit")}}function Ve(g,C){if(e.savedColors){g!=""&&e.savedColors.push(g),Jt=0,G.clearControls();const m=Math.ceil(e.savedColors.length/e.numSwatchesPerLine);let vt;if(m==0?vt=0:vt=m+1,G.rowCount!=m+vt){const Z=G.rowCount;for(let Lt=0;Lt<Z;Lt++)G.removeRowDefinition(0);for(let Lt=0;Lt<m+vt;Lt++)Lt%2?G.addRowDefinition(l,!0):G.addRowDefinition(r,!0)}G.height=(l*m+vt*r).toString()+"px";for(let Z=1,Lt=1;Z<m+vt;Z+=2,Lt++){let Ge;e.savedColors.length>Lt*e.numSwatchesPerLine?Ge=e.numSwatchesPerLine:Ge=e.savedColors.length-(Lt-1)*e.numSwatchesPerLine;const vi=Math.min(Math.max(Ge,0),e.numSwatchesPerLine);for(let Ue=0,Je=1;Ue<vi;Ue++){if(Ue>e.numSwatchesPerLine)continue;const ti=bi();if(ti!=null)G.addControl(ti,Z,Je),Je+=2,Jt++;else continue}}e.savedColors.length>=e.swatchLimit?We(C,!0):We(C,!1)}}function ze(g){g?(N=Qt.CreateSimpleButton("butEdit","Edit"),N.width=oe,N.height=ce,N.left=Math.floor(parseInt(oe)*.1).toString()+"px",N.top=(parseFloat(N.left)*-1).toString()+"px",N.verticalAlignment=c.VERTICAL_ALIGNMENT_BOTTOM,N.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,N.thickness=2,N.color=d,N.fontSize=ot,N.background=u,N.onPointerEnterObservable.add(()=>{N.background=I}),N.onPointerOutObservable.add(()=>{N.background=u}),N.pointerDownAnimation=()=>{N.background=k},N.pointerUpAnimation=()=>{N.background=I},N.onPointerClickObservable.add(()=>{Ht?Ht=!1:Ht=!0,pt()}),te.addControl(N,1,0)):te.removeControl(N)}function We(g,C){C?(g.color=It,g.background=Ie):(g.color=d,g.background=u)}function He(g){e.savedColors&&e.savedColors.length>0?i({savedColors:e.savedColors,pickedColor:g}):i({pickedColor:g}),t.removeControl(Ct)}})}}ut._Epsilon=1e-6;n([_()],ut.prototype,"value",null);n([_()],ut.prototype,"width",null);n([_()],ut.prototype,"height",null);n([_()],ut.prototype,"size",null);F("BABYLON.GUI.ColorPicker",ut);class li extends ht{get thickness(){return this._thickness}set thickness(t){this._thickness!==t&&(this._thickness=t,this._markAsDirty())}constructor(t){super(t),this.name=t,this._thickness=1}_getTypeName(){return"Ellipse"}_localDraw(t){t.save(),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),c.drawEllipse(this._currentMeasure.left+this._currentMeasure.width/2,this._currentMeasure.top+this._currentMeasure.height/2,this._currentMeasure.width/2-this._thickness/2,this._currentMeasure.height/2-this._thickness/2,t),(this._backgroundGradient||this._background)&&(t.fillStyle=this._getBackgroundColor(t),t.fill()),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),this._thickness&&(this.color&&(t.strokeStyle=this.color),t.lineWidth=this._thickness,t.stroke()),t.restore()}_additionalProcessing(t,e){super._additionalProcessing(t,e),this._measureForChildren.width-=2*this._thickness,this._measureForChildren.height-=2*this._thickness,this._measureForChildren.left+=this._thickness,this._measureForChildren.top+=this._thickness}_clipForChildren(t){c.drawEllipse(this._currentMeasure.left+this._currentMeasure.width/2,this._currentMeasure.top+this._currentMeasure.height/2,this._currentMeasure.width/2,this._currentMeasure.height/2,t),t.clip()}_renderHighlightSpecific(t){c.drawEllipse(this._currentMeasure.left+this._currentMeasure.width/2,this._currentMeasure.top+this._currentMeasure.height/2,this._currentMeasure.width/2-this._highlightLineWidth/2,this._currentMeasure.height/2-this._highlightLineWidth/2,t),t.stroke()}}n([_()],li.prototype,"thickness",null);F("BABYLON.GUI.Ellipse",li);class Si extends Qt{constructor(t){super(t),this.name=t,this.focusedColor=null,this._isFocused=!1,this._unfocusedColor=null,this.onFocusObservable=new T,this.onBlurObservable=new T,this.onKeyboardEventProcessedObservable=new T,this._unfocusedColor=this.color}onBlur(){this._isFocused&&(this._isFocused=!1,this.focusedColor&&this._unfocusedColor!=null&&(this.color=this._unfocusedColor),this.onBlurObservable.notifyObservers(this))}onFocus(){this._isFocused=!0,this.focusedColor&&(this._unfocusedColor=this.color,this.color=this.focusedColor),this.onFocusObservable.notifyObservers(this)}keepsFocusWith(){return null}focus(){this._host.moveFocusToControl(this)}blur(){this._host.focusedControl=null}processKeyboard(t){this.onKeyboardEventProcessedObservable.notifyObservers(t,-1,this)}_onPointerDown(t,e,i,s,o){return this.isReadOnly||this.focus(),super._onPointerDown(t,e,i,s,o)}displose(){super.dispose(),this.onBlurObservable.clear(),this.onFocusObservable.clear(),this.onKeyboardEventProcessedObservable.clear()}}F("BABYLON.GUI.FocusableButton",Si);class be extends z{get outlineWidth(){return this._outlineWidth}set outlineWidth(t){this._outlineWidth!==t&&(this._outlineWidth=t,this._markAsDirty())}get outlineColor(){return this._outlineColor}set outlineColor(t){this._outlineColor!==t&&(this._outlineColor=t,this._markAsDirty())}get autoStretchHeight(){return this._autoStretchHeight}set autoStretchHeight(t){this._autoStretchHeight!==t&&(this._autoStretchHeight=t,this._markAsDirty())}set height(t){this._fixedRatioMasterIsWidth=!1,this._height.toString(this._host)!==t&&(this._height.fromString(t)&&this._markAsDirty(),this._autoStretchHeight=!1)}get maxHeight(){return this._maxHeight.toString(this._host)}get maxHeightInPixels(){return this._maxHeight.getValueInPixel(this._host,this._cachedParentMeasure.height)}set maxHeight(t){this._maxHeight.toString(this._host)!==t&&this._maxHeight.fromString(t)&&this._markAsDirty()}constructor(t,e=""){super(t),this.name=t,this._textHorizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,this._textVerticalAlignment=c.VERTICAL_ALIGNMENT_TOP,this._lineSpacing=new p(0),this._outlineWidth=0,this._outlineColor="white",this._maxHeight=new p(1,p.UNITMODE_PERCENTAGE,!1),this.onLinesReadyObservable=new T,this.text=e,this.isPointerBlocker=!0,this.onLinesReadyObservable.add(()=>this._updateCursorPosition()),this._highlightCursorInfo={initialStartIndex:-1,initialRelativeStartIndex:-1,initialLineIndex:-1},this._cursorInfo={globalStartIndex:0,globalEndIndex:0,relativeEndIndex:0,relativeStartIndex:0,currentLineIndex:0}}_getTypeName(){return"InputTextArea"}processKeyboard(t){this.alternativeProcessKey(t.code,t.key,t),this.onKeyboardEventProcessedObservable.notifyObservers(t)}alternativeProcessKey(t,e,i){if(!(i&&(i.ctrlKey||i.metaKey)&&(t==="KeyC"||t==="KeyV"||t==="KeyX"))){switch(t){case"KeyA":if(i&&(i.ctrlKey||i.metaKey)){this._selectAllText(),i.preventDefault();return}break;case"Period":i&&i.shiftKey&&i.preventDefault();break;case"Backspace":!this._isTextHighlightOn&&this._cursorInfo.globalStartIndex>0&&(this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex,this._cursorInfo.globalStartIndex--),this._textWrapper.removePart(this._cursorInfo.globalStartIndex,this._cursorInfo.globalEndIndex),this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex,i&&i.preventDefault(),this._blinkIsEven=!1,this._isTextHighlightOn=!1,this._textHasChanged();break;case"Delete":!this._isTextHighlightOn&&this._cursorInfo.globalEndIndex<this.text.length&&(this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex+1),this._textWrapper.removePart(this._cursorInfo.globalStartIndex,this._cursorInfo.globalEndIndex),this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex,i&&i.preventDefault(),this._blinkIsEven=!1,this._isTextHighlightOn=!1,this._textHasChanged();break;case"Enter":this._textWrapper.removePart(this._cursorInfo.globalStartIndex,this._cursorInfo.globalEndIndex,`
`),this._cursorInfo.globalStartIndex++,this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex,this._blinkIsEven=!1,this._isTextHighlightOn=!1,this._textHasChanged();return;case"End":this._cursorInfo.globalStartIndex=this.text.length,this._blinkIsEven=!1,this._isTextHighlightOn=!1,this._markAsDirty();return;case"Home":this._cursorInfo.globalStartIndex=0,this._blinkIsEven=!1,this._isTextHighlightOn=!1,this._markAsDirty();return;case"ArrowLeft":if(this._markAsDirty(),i&&i.shiftKey){(i.ctrlKey||i.metaKey)&&(this._cursorInfo.globalStartIndex-=this._cursorInfo.relativeStartIndex,this._cursorInfo.globalEndIndex=this._highlightCursorInfo.initialStartIndex),this._isTextHighlightOn?this._cursorInfo.globalEndIndex>this._highlightCursorInfo.initialStartIndex?this._cursorInfo.globalEndIndex--:this._cursorInfo.globalStartIndex--:(this._highlightCursorInfo.initialLineIndex=this._cursorInfo.currentLineIndex,this._highlightCursorInfo.initialStartIndex=this._cursorInfo.globalStartIndex,this._highlightCursorInfo.initialRelativeStartIndex=this._cursorInfo.relativeStartIndex,this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex,this._cursorInfo.globalStartIndex--,this._isTextHighlightOn=!0),this._blinkIsEven=!0,i.preventDefault();return}this._isTextHighlightOn?this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex:i&&(i.ctrlKey||i.metaKey)?(this._cursorInfo.globalStartIndex-=this._cursorInfo.relativeStartIndex,i.preventDefault()):this._cursorInfo.globalStartIndex>0&&this._cursorInfo.globalStartIndex--,this._blinkIsEven=!1,this._isTextHighlightOn=!1;return;case"ArrowRight":if(this._markAsDirty(),i&&i.shiftKey){if(i.ctrlKey||i.metaKey){const s=this._lines[this._cursorInfo.currentLineIndex].text.length-this._cursorInfo.relativeEndIndex-1;this._cursorInfo.globalEndIndex+=s,this._cursorInfo.globalStartIndex=this._highlightCursorInfo.initialStartIndex}this._isTextHighlightOn?this._cursorInfo.globalStartIndex<this._highlightCursorInfo.initialStartIndex?this._cursorInfo.globalStartIndex++:this._cursorInfo.globalEndIndex++:(this._highlightCursorInfo.initialLineIndex=this._cursorInfo.currentLineIndex,this._highlightCursorInfo.initialStartIndex=this._cursorInfo.globalStartIndex,this._highlightCursorInfo.initialRelativeStartIndex=this._cursorInfo.relativeStartIndex,this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex,this._cursorInfo.globalEndIndex++,this._isTextHighlightOn=!0),this._blinkIsEven=!0,i.preventDefault();return}if(this._isTextHighlightOn)this._cursorInfo.globalStartIndex=this._cursorInfo.globalEndIndex;else if(i&&(i.ctrlKey||i.metaKey)){const s=this._lines[this._cursorInfo.currentLineIndex].text.length-this._cursorInfo.relativeEndIndex;this._cursorInfo.globalStartIndex+=s}else this._cursorInfo.globalStartIndex<this.text.length&&this._cursorInfo.globalStartIndex++;this._blinkIsEven=!1,this._isTextHighlightOn=!1;return;case"ArrowUp":if(this._blinkIsEven=!1,i&&(i.shiftKey?(this._isTextHighlightOn||(this._highlightCursorInfo.initialLineIndex=this._cursorInfo.currentLineIndex,this._highlightCursorInfo.initialStartIndex=this._cursorInfo.globalStartIndex,this._highlightCursorInfo.initialRelativeStartIndex=this._cursorInfo.relativeStartIndex),this._isTextHighlightOn=!0,this._blinkIsEven=!0):this._isTextHighlightOn=!1,i.preventDefault()),this._cursorInfo.currentLineIndex===0)this._cursorInfo.globalStartIndex=0;else{const s=this._lines[this._cursorInfo.currentLineIndex],o=this._lines[this._cursorInfo.currentLineIndex-1];let r=0,a=0;!this._isTextHighlightOn||this._cursorInfo.currentLineIndex<this._highlightCursorInfo.initialLineIndex?(r=this._cursorInfo.globalStartIndex,a=this._cursorInfo.relativeStartIndex):(r=this._cursorInfo.globalEndIndex,a=this._cursorInfo.relativeEndIndex);const l=s.text.substr(0,a),h=this._contextForBreakLines.measureText(l).width;let f=0,d=0;r-=a,r-=o.text.length+o.lineEnding.length;let u=0;for(;f<h&&u<o.text.length;)r++,u++,d=Math.abs(h-f),f=this._contextForBreakLines.measureText(o.text.substr(0,u)).width;Math.abs(h-f)>d&&u>0&&r--,this._isTextHighlightOn?this._cursorInfo.currentLineIndex<=this._highlightCursorInfo.initialLineIndex?(this._cursorInfo.globalStartIndex=r,this._cursorInfo.globalEndIndex=this._highlightCursorInfo.initialStartIndex,this._cursorInfo.relativeEndIndex=this._highlightCursorInfo.initialRelativeStartIndex):this._cursorInfo.globalEndIndex=r:this._cursorInfo.globalStartIndex=r}this._markAsDirty();return;case"ArrowDown":if(this._blinkIsEven=!1,i&&(i.shiftKey?(this._isTextHighlightOn||(this._highlightCursorInfo.initialLineIndex=this._cursorInfo.currentLineIndex,this._highlightCursorInfo.initialStartIndex=this._cursorInfo.globalStartIndex,this._highlightCursorInfo.initialRelativeStartIndex=this._cursorInfo.relativeStartIndex),this._isTextHighlightOn=!0,this._blinkIsEven=!0):this._isTextHighlightOn=!1,i.preventDefault()),this._cursorInfo.currentLineIndex===this._lines.length-1)this._cursorInfo.globalStartIndex=this.text.length;else{const s=this._lines[this._cursorInfo.currentLineIndex],o=this._lines[this._cursorInfo.currentLineIndex+1];let r=0,a=0;!this._isTextHighlightOn||this._cursorInfo.currentLineIndex<this._highlightCursorInfo.initialLineIndex?(r=this._cursorInfo.globalStartIndex,a=this._cursorInfo.relativeStartIndex):(r=this._cursorInfo.globalEndIndex,a=this._cursorInfo.relativeEndIndex);const l=s.text.substr(0,a),h=this._contextForBreakLines.measureText(l).width;let f=0,d=0;r+=s.text.length-a+s.lineEnding.length;let u=0;for(;f<h&&u<o.text.length;)r++,u++,d=Math.abs(h-f),f=this._contextForBreakLines.measureText(o.text.substr(0,u)).width;Math.abs(h-f)>d&&u>0&&r--,this._isTextHighlightOn?this._cursorInfo.currentLineIndex<this._highlightCursorInfo.initialLineIndex?(this._cursorInfo.globalStartIndex=r,this._cursorInfo.globalStartIndex>this._cursorInfo.globalEndIndex&&(this._cursorInfo.globalEndIndex+=this._cursorInfo.globalStartIndex,this._cursorInfo.globalStartIndex=this._cursorInfo.globalEndIndex-this._cursorInfo.globalStartIndex,this._cursorInfo.globalEndIndex-=this._cursorInfo.globalStartIndex)):(this._cursorInfo.globalEndIndex=r,this._cursorInfo.globalStartIndex=this._highlightCursorInfo.initialStartIndex):this._cursorInfo.globalStartIndex=r}this._markAsDirty();return}(e==null?void 0:e.length)===1&&(i==null||i.preventDefault(),this._currentKey=e,this.onBeforeKeyAddObservable.notifyObservers(this),e=this._currentKey,this._addKey&&(this._isTextHighlightOn=!1,this._blinkIsEven=!1,this._textWrapper.removePart(this._cursorInfo.globalStartIndex,this._cursorInfo.globalEndIndex,e),this._cursorInfo.globalStartIndex+=e.length,this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex,this._textHasChanged()))}}_parseLineWordWrap(t="",e,i){const s=[],o=t.split(" ");let r=0;for(let a=0;a<o.length;a++){const l=a>0?t+" "+o[a]:o[0],f=i.measureText(l).width;if(f>e){a>0&&(r=i.measureText(t).width,s.push({text:t,width:r,lineEnding:" "})),t=o[a];let d="";t.split("").map(u=>{i.measureText(d+u).width>e&&(s.push({text:d,width:i.measureText(d).width,lineEnding:`
`}),d=""),d+=u}),t=d,r=i.measureText(t).width}else r=f,t=l}return s.push({text:t,width:r,lineEnding:" "}),s}_breakLines(t,e){const i=[],s=this.text.split(`
`);if(this.clipContent)for(const o of s)i.push(...this._parseLineWordWrap(o,t,e));else for(const o of s)i.push(this._parseLine(o,e));return i[i.length-1].lineEnding=`
`,i}_parseLine(t="",e){return{text:t,width:e.measureText(t).width,lineEnding:" "}}_preMeasure(t,e){(!this._fontOffset||this._wasDirty)&&(this._fontOffset=c._GetFontOffset(e.font));let i=this._beforeRenderText(this._textWrapper).text;!this._isFocused&&!this.text&&this._placeholderText&&(i=this._placeholderText,this._placeholderColor&&(e.fillStyle=this._placeholderColor)),this._textWidth=e.measureText(i).width;const s=this._margin.getValueInPixel(this._host,t.width)*2;if(this._autoStretchWidth){const r=i.split(`
`).reduce((l,h)=>{const f=e.measureText(h).width,d=e.measureText(l).width;return f>d?h:l},""),a=e.measureText(r).width;this.width=Math.min(this._maxWidth.getValueInPixel(this._host,t.width),a+s)+"px",this.autoStretchWidth=!0}if(this._availableWidth=this._width.getValueInPixel(this._host,t.width)-s,this._lines=this._breakLines(this._availableWidth,e),this._contextForBreakLines=e,this._autoStretchHeight){const r=this._lines.length*this._fontOffset.height+this._margin.getValueInPixel(this._host,t.height)*2;this.height=Math.min(this._maxHeight.getValueInPixel(this._host,t.height),r)+"px",this._autoStretchHeight=!0}if(this._availableHeight=this._height.getValueInPixel(this._host,t.height)-s,this._isFocused){this._cursorInfo.currentLineIndex=0;let o=this._lines[this._cursorInfo.currentLineIndex].text.length+this._lines[this._cursorInfo.currentLineIndex].lineEnding.length,r=0;for(;r+o<=this._cursorInfo.globalStartIndex;)r+=o,this._cursorInfo.currentLineIndex<this._lines.length-1&&(this._cursorInfo.currentLineIndex++,o=this._lines[this._cursorInfo.currentLineIndex].text.length+this._lines[this._cursorInfo.currentLineIndex].lineEnding.length)}}_computeScroll(){if(this._clipTextLeft=this._currentMeasure.left+this._margin.getValueInPixel(this._host,this._cachedParentMeasure.width),this._clipTextTop=this._currentMeasure.top+this._margin.getValueInPixel(this._host,this._cachedParentMeasure.height),this._isFocused&&this._lines[this._cursorInfo.currentLineIndex].width>this._availableWidth){const t=this._clipTextLeft-this._lines[this._cursorInfo.currentLineIndex].width+this._availableWidth;this._scrollLeft||(this._scrollLeft=t)}else this._scrollLeft=this._clipTextLeft;if(this._isFocused&&!this._autoStretchHeight){const t=(this._cursorInfo.currentLineIndex+1)*this._fontOffset.height,e=this._clipTextTop-t;this._scrollTop||(this._scrollTop=e)}else this._scrollTop=this._clipTextTop}_additionalProcessing(){this.highlightedText="",this.onLinesReadyObservable.notifyObservers(this)}_drawText(t,e,i,s){const o=this._currentMeasure.width;let r=this._scrollLeft;switch(this._textHorizontalAlignment){case c.HORIZONTAL_ALIGNMENT_LEFT:r+=0;break;case c.HORIZONTAL_ALIGNMENT_RIGHT:r+=o-e;break;case c.HORIZONTAL_ALIGNMENT_CENTER:r+=(o-e)/2;break}(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(s.shadowColor=this.shadowColor,s.shadowBlur=this.shadowBlur,s.shadowOffsetX=this.shadowOffsetX,s.shadowOffsetY=this.shadowOffsetY),this.outlineWidth&&s.strokeText(t,this._currentMeasure.left+r,i),s.fillText(t,r,i)}_onCopyText(t){this._isTextHighlightOn=!1;try{t.clipboardData&&t.clipboardData.setData("text/plain",this._highlightedText)}catch{}this._host.clipboardData=this._highlightedText}_onCutText(t){if(this._highlightedText){try{t.clipboardData&&t.clipboardData.setData("text/plain",this._highlightedText)}catch{}this._host.clipboardData=this._highlightedText,this._textWrapper.removePart(this._cursorInfo.globalStartIndex,this._cursorInfo.globalEndIndex),this._textHasChanged()}}_onPasteText(t){let e="";t.clipboardData&&t.clipboardData.types.indexOf("text/plain")!==-1?e=t.clipboardData.getData("text/plain"):e=this._host.clipboardData,this._isTextHighlightOn=!1,this._textWrapper.removePart(this._cursorInfo.globalStartIndex,this._cursorInfo.globalEndIndex,e);const i=e.length-(this._cursorInfo.globalEndIndex-this._cursorInfo.globalStartIndex);this._cursorInfo.globalStartIndex+=i,this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex,this._textHasChanged()}_draw(t){var e,i;this._computeScroll(),this._scrollLeft=(e=this._scrollLeft)!==null&&e!==void 0?e:0,this._scrollTop=(i=this._scrollTop)!==null&&i!==void 0?i:0,t.save(),this._applyStates(t),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),this._isFocused?this._focusedBackground&&(t.fillStyle=this._isEnabled?this._focusedBackground:this._disabledColor,t.fillRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height)):this._background&&(t.fillStyle=this._isEnabled?this._background:this._disabledColor,t.fillRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height)),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),this.color&&(t.fillStyle=this.color);const s=this._currentMeasure.height,o=this._currentMeasure.width;let r=0;switch(this._textVerticalAlignment){case c.VERTICAL_ALIGNMENT_TOP:r=this._fontOffset.ascent;break;case c.VERTICAL_ALIGNMENT_BOTTOM:r=s-this._fontOffset.height*(this._lines.length-1)-this._fontOffset.descent;break;case c.VERTICAL_ALIGNMENT_CENTER:r=this._fontOffset.ascent+(s-this._fontOffset.height*this._lines.length)/2;break}t.save(),t.beginPath(),t.fillStyle=this.fontStyle,t.rect(this._clipTextLeft,this._clipTextTop,this._availableWidth+2,this._availableHeight+2),t.clip(),r+=this._scrollTop;for(let a=0;a<this._lines.length;a++){const l=this._lines[a];a!==0&&this._lineSpacing.internalValue!==0&&(this._lineSpacing.isPixel?r+=this._lineSpacing.getValue(this._host):r=r+this._lineSpacing.getValue(this._host)*this._height.getValueInPixel(this._host,this._cachedParentMeasure.height)),this._drawText(l.text,l.width,r,t),r+=this._fontOffset.height}if(t.restore(),this._isFocused){if(!this._blinkIsEven||this._isTextHighlightOn){let a=this._scrollLeft+t.measureText(this._lines[this._cursorInfo.currentLineIndex].text.substr(0,this._cursorInfo.relativeStartIndex)).width;a<this._clipTextLeft?(this._scrollLeft+=this._clipTextLeft-a,a=this._clipTextLeft,this._markAsDirty()):a>this._clipTextLeft+this._availableWidth&&(this._scrollLeft+=this._clipTextLeft+this._availableWidth-a,a=this._clipTextLeft+this._availableWidth,this._markAsDirty());let l=this._scrollTop+this._cursorInfo.currentLineIndex*this._fontOffset.height;l<this._clipTextTop?(this._scrollTop+=this._clipTextTop-l,l=this._clipTextTop,this._markAsDirty()):l+this._fontOffset.height>this._clipTextTop+this._availableHeight&&(this._scrollTop+=this._clipTextTop+this._availableHeight-l-this._fontOffset.height,l=this._clipTextTop+this._availableHeight-this._fontOffset.height,this._markAsDirty()),this._isTextHighlightOn||t.fillRect(a,l,2,this._fontOffset.height)}if(this._resetBlinking(),this._isTextHighlightOn){clearTimeout(this._blinkTimeout),this._highlightedText=this.text.substring(this._cursorInfo.globalStartIndex,this._cursorInfo.globalEndIndex),t.globalAlpha=this._highligherOpacity,t.fillStyle=this._textHighlightColor;const a=Math.min(this._cursorInfo.currentLineIndex,this._highlightCursorInfo.initialLineIndex),l=Math.max(this._cursorInfo.currentLineIndex,this._highlightCursorInfo.initialLineIndex);let h=this._scrollTop+a*this._fontOffset.height;for(let f=a;f<=l;f++){const d=this._lines[f];let u=this._scrollLeft;switch(this._textHorizontalAlignment){case c.HORIZONTAL_ALIGNMENT_LEFT:u+=0;break;case c.HORIZONTAL_ALIGNMENT_RIGHT:u+=o-d.width;break;case c.HORIZONTAL_ALIGNMENT_CENTER:u+=(o-d.width)/2;break}const I=f===a?this._cursorInfo.relativeStartIndex:0,k=f===l?this._cursorInfo.relativeEndIndex:d.text.length,It=t.measureText(d.text.substr(0,I)).width,Ie=d.text.substring(I,k),wt=t.measureText(Ie).width;t.fillRect(u+It,h,wt,this._fontOffset.height),h+=this._fontOffset.height}this._cursorInfo.globalEndIndex===this._cursorInfo.globalStartIndex&&this._resetBlinking()}}t.restore(),this._thickness&&(this._isFocused?this.focusedColor&&(t.strokeStyle=this.focusedColor):this.color&&(t.strokeStyle=this.color),t.lineWidth=this._thickness,t.strokeRect(this._currentMeasure.left+this._thickness/2,this._currentMeasure.top+this._thickness/2,this._currentMeasure.width-this._thickness,this._currentMeasure.height-this._thickness))}_resetBlinking(){clearTimeout(this._blinkTimeout),this._blinkTimeout=setTimeout(()=>{this._blinkIsEven=!this._blinkIsEven,this._markAsDirty()},500)}_applyStates(t){super._applyStates(t),this.outlineWidth&&(t.lineWidth=this.outlineWidth,t.strokeStyle=this.outlineColor)}_onPointerDown(t,e,i,s,o){return super._onPointerDown(t,e,i,s,o)?(this._clickedCoordinateX=e.x,this._clickedCoordinateY=e.y,this._isTextHighlightOn=!1,this._highlightedText="",this._isPointerDown=!0,this._host._capturingControl[i]=this,this._host.focusedControl===this?(clearTimeout(this._blinkTimeout),this._markAsDirty(),!0):this._isEnabled?(this._host.focusedControl=this,!0):!1):!1}_onPointerMove(t,e,i,s){s.event.movementX===0&&s.event.movementY===0||(this._host.focusedControl===this&&this._isPointerDown&&(this._clickedCoordinateX=e.x,this._clickedCoordinateY=e.y,this._isTextHighlightOn||(this._highlightCursorInfo.initialLineIndex=this._cursorInfo.currentLineIndex,this._highlightCursorInfo.initialStartIndex=this._cursorInfo.globalStartIndex,this._highlightCursorInfo.initialRelativeStartIndex=this._cursorInfo.relativeStartIndex,this._isTextHighlightOn=!0),this._markAsDirty()),super._onPointerMove(t,e,i,s))}_updateCursorPosition(){var t;if(this._isFocused)if(this._clickedCoordinateX&&this._clickedCoordinateY){this._isTextHighlightOn||(this._cursorInfo={globalStartIndex:0,globalEndIndex:0,relativeStartIndex:0,relativeEndIndex:0,currentLineIndex:0});let e=0,i=0;const s=this._clickedCoordinateY-this._scrollTop,o=Math.floor(s/this._fontOffset.height);this._cursorInfo.currentLineIndex=Math.min(Math.max(o,0),this._lines.length-1);let r=0;const a=this._clickedCoordinateX-((t=this._scrollLeft)!==null&&t!==void 0?t:0);let l=0;for(let h=0;h<this._cursorInfo.currentLineIndex;h++){const f=this._lines[h];e+=f.text.length+f.lineEnding.length}for(;r<a&&this._lines[this._cursorInfo.currentLineIndex].text.length>i;)i++,l=Math.abs(a-r),r=this._contextForBreakLines.measureText(this._lines[this._cursorInfo.currentLineIndex].text.substr(0,i)).width;Math.abs(a-r)>l&&i>0&&i--,e+=i,this._isTextHighlightOn?e<this._highlightCursorInfo.initialStartIndex?(this._cursorInfo.globalStartIndex=e,this._cursorInfo.relativeStartIndex=i,this._cursorInfo.globalEndIndex=this._highlightCursorInfo.initialStartIndex,this._cursorInfo.relativeEndIndex=this._highlightCursorInfo.initialRelativeStartIndex):(this._cursorInfo.globalStartIndex=this._highlightCursorInfo.initialStartIndex,this._cursorInfo.relativeStartIndex=this._highlightCursorInfo.initialRelativeStartIndex,this._cursorInfo.globalEndIndex=e,this._cursorInfo.relativeEndIndex=i):(this._cursorInfo.globalStartIndex=e,this._cursorInfo.relativeStartIndex=i,this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex,this._cursorInfo.relativeEndIndex=this._cursorInfo.relativeStartIndex),this._blinkIsEven=this._isTextHighlightOn,this._clickedCoordinateX=null,this._clickedCoordinateY=null}else{this._cursorInfo.relativeStartIndex=0,this._cursorInfo.currentLineIndex=0;let e=this._lines[this._cursorInfo.currentLineIndex].text.length+this._lines[this._cursorInfo.currentLineIndex].lineEnding.length,i=0;for(;i+e<=this._cursorInfo.globalStartIndex;)i+=e,this._cursorInfo.currentLineIndex<this._lines.length-1&&(this._cursorInfo.currentLineIndex++,e=this._lines[this._cursorInfo.currentLineIndex].text.length+this._lines[this._cursorInfo.currentLineIndex].lineEnding.length);if(this._cursorInfo.relativeStartIndex=this._cursorInfo.globalStartIndex-i,this._highlightCursorInfo.initialStartIndex!==-1&&this._cursorInfo.globalStartIndex>=this._highlightCursorInfo.initialStartIndex){for(;i+e<=this._cursorInfo.globalEndIndex;)i+=e,this._cursorInfo.currentLineIndex<this._lines.length-1&&(this._cursorInfo.currentLineIndex++,e=this._lines[this._cursorInfo.currentLineIndex].text.length+this._lines[this._cursorInfo.currentLineIndex].lineEnding.length);this._cursorInfo.relativeEndIndex=this._cursorInfo.globalEndIndex-i}else this._isTextHighlightOn||(this._cursorInfo.relativeEndIndex=this._cursorInfo.relativeStartIndex,this._cursorInfo.globalEndIndex=this._cursorInfo.globalStartIndex)}}_updateValueFromCursorIndex(t){}_processDblClick(t){let e,i;do e=this._cursorInfo.globalStartIndex>0&&this._textWrapper.isWord(this._cursorInfo.globalStartIndex-1)?--this._cursorInfo.globalStartIndex:0,i=this._cursorInfo.globalEndIndex<this._textWrapper.length&&this._textWrapper.isWord(this._cursorInfo.globalEndIndex)?++this._cursorInfo.globalEndIndex:0;while(e||i);this._highlightCursorInfo.initialLineIndex=this._cursorInfo.currentLineIndex,this._highlightCursorInfo.initialStartIndex=this._cursorInfo.globalStartIndex,this.onTextHighlightObservable.notifyObservers(this),this._isTextHighlightOn=!0,this._blinkIsEven=!0,this._markAsDirty()}_selectAllText(){this._isTextHighlightOn=!0,this._blinkIsEven=!0,this._highlightCursorInfo={initialStartIndex:0,initialRelativeStartIndex:0,initialLineIndex:0},this._cursorInfo={globalStartIndex:0,globalEndIndex:this._textWrapper.length,relativeEndIndex:this._lines[this._lines.length-1].text.length,relativeStartIndex:0,currentLineIndex:this._lines.length-1},this._markAsDirty()}dipose(){super.dispose(),this.onLinesReadyObservable.clear()}}n([_()],be.prototype,"autoStretchHeight",null);n([_()],be.prototype,"maxHeight",null);F("BABYLON.GUI.InputTextArea",be);class Ri extends z{_getTypeName(){return"InputPassword"}_beforeRenderText(t){const e=new Ke;let i="";for(let s=0;s<t.length;s++)i+="•";return e.text=i,e}}F("BABYLON.GUI.InputPassword",Ri);class le extends c{get dash(){return this._dash}set dash(t){this._dash!==t&&(this._dash=t,this._markAsDirty())}get connectedControl(){return this._connectedControl}set connectedControl(t){this._connectedControl!==t&&(this._connectedControlDirtyObserver&&this._connectedControl&&(this._connectedControl.onDirtyObservable.remove(this._connectedControlDirtyObserver),this._connectedControlDirtyObserver=null),t&&(this._connectedControlDirtyObserver=t.onDirtyObservable.add(()=>this._markAsDirty())),this._connectedControl=t,this._markAsDirty())}get x1(){return this._x1.toString(this._host)}set x1(t){this._x1.toString(this._host)!==t&&this._x1.fromString(t)&&this._markAsDirty()}get y1(){return this._y1.toString(this._host)}set y1(t){this._y1.toString(this._host)!==t&&this._y1.fromString(t)&&this._markAsDirty()}get x2(){return this._x2.toString(this._host)}set x2(t){this._x2.toString(this._host)!==t&&this._x2.fromString(t)&&this._markAsDirty()}get y2(){return this._y2.toString(this._host)}set y2(t){this._y2.toString(this._host)!==t&&this._y2.fromString(t)&&this._markAsDirty()}get lineWidth(){return this._lineWidth}set lineWidth(t){this._lineWidth!==t&&(this._lineWidth=t,this._markAsDirty())}set horizontalAlignment(t){}set verticalAlignment(t){}get _effectiveX2(){return(this._connectedControl?this._connectedControl.centerX:0)+this._x2.getValue(this._host)}get _effectiveY2(){return(this._connectedControl?this._connectedControl.centerY:0)+this._y2.getValue(this._host)}constructor(t){super(t),this.name=t,this._lineWidth=1,this._x1=new p(0),this._y1=new p(0),this._x2=new p(0),this._y2=new p(0),this._dash=new Array,this._automaticSize=!0,this.isHitTestVisible=!1,this._horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,this._verticalAlignment=c.VERTICAL_ALIGNMENT_TOP}_getTypeName(){return"Line"}_draw(t){t.save(),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),this._applyStates(t),t.strokeStyle=this._getColor(t),t.lineWidth=this._lineWidth,t.setLineDash(this._dash),t.beginPath(),t.moveTo(this._cachedParentMeasure.left+this._x1.getValue(this._host),this._cachedParentMeasure.top+this._y1.getValue(this._host)),t.lineTo(this._cachedParentMeasure.left+this._effectiveX2,this._cachedParentMeasure.top+this._effectiveY2),t.stroke(),t.restore()}_measure(){this._currentMeasure.width=Math.abs(this._x1.getValue(this._host)-this._effectiveX2)+this._lineWidth,this._currentMeasure.height=Math.abs(this._y1.getValue(this._host)-this._effectiveY2)+this._lineWidth}_computeAlignment(t){this._currentMeasure.left=t.left+Math.min(this._x1.getValue(this._host),this._effectiveX2)-this._lineWidth/2,this._currentMeasure.top=t.top+Math.min(this._y1.getValue(this._host),this._effectiveY2)-this._lineWidth/2}moveToVector3(t,e,i=!1){if(!this._host||this.parent!==this._host._rootContainer){gt.Error("Cannot move a control to a vector3 if the control is not at root level");return}const s=this._host._getGlobalViewport(),o=D.Project(t,si.IdentityReadOnly,e.getTransformMatrix(),s);if(this._moveToProjectedPosition(o,i),o.z<0||o.z>1){this.notRenderable=!0;return}this.notRenderable=!1}_moveToProjectedPosition(t,e=!1){const i=t.x+this._linkOffsetX.getValue(this._host)+"px",s=t.y+this._linkOffsetY.getValue(this._host)+"px";e?(this.x2=i,this.y2=s,this._x2.ignoreAdaptiveScaling=!0,this._y2.ignoreAdaptiveScaling=!0):(this.x1=i,this.y1=s,this._x1.ignoreAdaptiveScaling=!0,this._y1.ignoreAdaptiveScaling=!0)}}n([_()],le.prototype,"dash",null);n([_()],le.prototype,"x1",null);n([_()],le.prototype,"y1",null);n([_()],le.prototype,"x2",null);n([_()],le.prototype,"y2",null);n([_()],le.prototype,"lineWidth",null);F("BABYLON.GUI.Line",le);class ei{constructor(t){this._multiLine=t,this._x=new p(0),this._y=new p(0),this._point=new D(0,0,0)}get x(){return this._x.toString(this._multiLine._host)}set x(t){this._x.toString(this._multiLine._host)!==t&&this._x.fromString(t)&&this._multiLine._markAsDirty()}get y(){return this._y.toString(this._multiLine._host)}set y(t){this._y.toString(this._multiLine._host)!==t&&this._y.fromString(t)&&this._multiLine._markAsDirty()}get control(){return this._control}set control(t){this._control!==t&&(this._control&&this._controlObserver&&(this._control.onDirtyObservable.remove(this._controlObserver),this._controlObserver=null),this._control=t,this._control&&(this._controlObserver=this._control.onDirtyObservable.add(this._multiLine.onPointUpdate)),this._multiLine._markAsDirty())}get mesh(){return this._mesh}set mesh(t){this._mesh!==t&&(this._mesh&&this._meshObserver&&this._mesh.getScene().onAfterCameraRenderObservable.remove(this._meshObserver),this._mesh=t,this._mesh&&(this._meshObserver=this._mesh.getScene().onAfterCameraRenderObservable.add(this._multiLine.onPointUpdate)),this._multiLine._markAsDirty())}resetLinks(){this.control=null,this.mesh=null}translate(){return this._point=this._translatePoint(),this._point}_translatePoint(){if(this._mesh!=null)return this._multiLine._host.getProjectedPositionWithZ(this._mesh.getBoundingInfo().boundingSphere.center,this._mesh.getWorldMatrix());if(this._control!=null)return new D(this._control.centerX,this._control.centerY,1-Ne);{const t=this._multiLine._host,e=this._x.getValueInPixel(t,Number(t._canvas.width)),i=this._y.getValueInPixel(t,Number(t._canvas.height));return new D(e,i,1-Ne)}}dispose(){this.resetLinks()}}class hi extends c{constructor(t){super(t),this.name=t,this._lineWidth=1,this.onPointUpdate=()=>{this._markAsDirty()},this._automaticSize=!0,this.isHitTestVisible=!1,this._horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,this._verticalAlignment=c.VERTICAL_ALIGNMENT_TOP,this._dash=[],this._points=[]}get dash(){return this._dash}set dash(t){this._dash!==t&&(this._dash=t,this._markAsDirty())}getAt(t){return this._points[t]||(this._points[t]=new ei(this)),this._points[t]}add(...t){return t.map(e=>this.push(e))}push(t){const e=this.getAt(this._points.length);return t==null||(t instanceof pi?e.mesh=t:t instanceof c?e.control=t:t.x!=null&&t.y!=null&&(e.x=t.x,e.y=t.y)),e}remove(t){let e;if(t instanceof ei){if(e=this._points.indexOf(t),e===-1)return}else e=t;const i=this._points[e];i&&(i.dispose(),this._points.splice(e,1))}reset(){for(;this._points.length>0;)this.remove(this._points.length-1)}resetLinks(){this._points.forEach(t=>{t!=null&&t.resetLinks()})}get lineWidth(){return this._lineWidth}set lineWidth(t){this._lineWidth!==t&&(this._lineWidth=t,this._markAsDirty())}set horizontalAlignment(t){}set verticalAlignment(t){}_getTypeName(){return"MultiLine"}_draw(t){t.save(),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),this._applyStates(t),t.strokeStyle=this.color,t.lineWidth=this._lineWidth,t.setLineDash(this._dash),t.beginPath();let e=!0,i;this._points.forEach(s=>{s&&(e?(t.moveTo(s._point.x,s._point.y),e=!1):s._point.z<1&&i.z<1?t.lineTo(s._point.x,s._point.y):t.moveTo(s._point.x,s._point.y),i=s._point)}),t.stroke(),t.restore()}_additionalProcessing(){this._minX=null,this._minY=null,this._maxX=null,this._maxY=null,this._points.forEach(t=>{t&&(t.translate(),(this._minX==null||t._point.x<this._minX)&&(this._minX=t._point.x),(this._minY==null||t._point.y<this._minY)&&(this._minY=t._point.y),(this._maxX==null||t._point.x>this._maxX)&&(this._maxX=t._point.x),(this._maxY==null||t._point.y>this._maxY)&&(this._maxY=t._point.y))}),this._minX==null&&(this._minX=0),this._minY==null&&(this._minY=0),this._maxX==null&&(this._maxX=0),this._maxY==null&&(this._maxY=0)}_measure(){this._minX==null||this._maxX==null||this._minY==null||this._maxY==null||(this._currentMeasure.width=Math.abs(this._maxX-this._minX)+this._lineWidth,this._currentMeasure.height=Math.abs(this._maxY-this._minY)+this._lineWidth)}_computeAlignment(){this._minX==null||this._minY==null||(this._currentMeasure.left=this._minX-this._lineWidth/2,this._currentMeasure.top=this._minY-this._lineWidth/2)}dispose(){this.reset(),super.dispose()}}n([_()],hi.prototype,"dash",null);F("BABYLON.GUI.MultiLine",hi);class Zt extends c{get thickness(){return this._thickness}set thickness(t){this._thickness!==t&&(this._thickness=t,this._markAsDirty())}get checkSizeRatio(){return this._checkSizeRatio}set checkSizeRatio(t){t=Math.max(Math.min(1,t),0),this._checkSizeRatio!==t&&(this._checkSizeRatio=t,this._markAsDirty())}get background(){return this._background}set background(t){this._background!==t&&(this._background=t,this._markAsDirty())}get isChecked(){return this._isChecked}set isChecked(t){this._isChecked!==t&&(this._isChecked=t,this._markAsDirty(),this.onIsCheckedChangedObservable.notifyObservers(t),this._isChecked&&this._host&&this._host.executeOnAllControls(e=>{if(e===this||e.group===void 0)return;const i=e;i.group===this.group&&(i.isChecked=!1)}))}constructor(t){super(t),this.name=t,this._isChecked=!1,this._background="black",this._checkSizeRatio=.8,this._thickness=1,this.group="",this.onIsCheckedChangedObservable=new T,this.isPointerBlocker=!0}_getTypeName(){return"RadioButton"}_draw(t){t.save(),this._applyStates(t);const e=this._currentMeasure.width-this._thickness,i=this._currentMeasure.height-this._thickness;if((this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),c.drawEllipse(this._currentMeasure.left+this._currentMeasure.width/2,this._currentMeasure.top+this._currentMeasure.height/2,this._currentMeasure.width/2-this._thickness/2,this._currentMeasure.height/2-this._thickness/2,t),t.fillStyle=this._isEnabled?this._background:this._disabledColor,t.fill(),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),t.strokeStyle=this.color,t.lineWidth=this._thickness,t.stroke(),this._isChecked){t.fillStyle=this._isEnabled?this.color:this._disabledColor;const s=e*this._checkSizeRatio,o=i*this._checkSizeRatio;c.drawEllipse(this._currentMeasure.left+this._currentMeasure.width/2,this._currentMeasure.top+this._currentMeasure.height/2,s/2-this._thickness/2,o/2-this._thickness/2,t),t.fill()}t.restore()}_onPointerDown(t,e,i,s,o){return super._onPointerDown(t,e,i,s,o)?(this.isReadOnly||this.isChecked||(this.isChecked=!0),!0):!1}static AddRadioButtonWithHeader(t,e,i,s){const o=new St;o.isVertical=!1,o.height="30px";const r=new Zt;r.width="20px",r.height="20px",r.isChecked=i,r.color="green",r.group=e,r.onIsCheckedChangedObservable.add(l=>s(r,l)),o.addControl(r);const a=new U;return a.text=t,a.width="180px",a.paddingLeft="5px",a.textHorizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,a.color="white",o.addControl(a),o}}n([_()],Zt.prototype,"thickness",null);n([_()],Zt.prototype,"group",void 0);n([_()],Zt.prototype,"checkSizeRatio",null);n([_()],Zt.prototype,"background",null);n([_()],Zt.prototype,"isChecked",null);F("BABYLON.GUI.RadioButton",Zt);class xt extends c{get displayThumb(){return this._displayThumb}set displayThumb(t){this._displayThumb!==t&&(this._displayThumb=t,this._markAsDirty())}get step(){return this._step}set step(t){this._step!==t&&(this._step=t,this._markAsDirty())}get barOffset(){return this._barOffset.toString(this._host)}get barOffsetInPixels(){return this._barOffset.getValueInPixel(this._host,this._cachedParentMeasure.width)}set barOffset(t){this._barOffset.toString(this._host)!==t&&this._barOffset.fromString(t)&&this._markAsDirty()}get thumbWidth(){return this._thumbWidth.toString(this._host)}get thumbWidthInPixels(){return this._thumbWidth.getValueInPixel(this._host,this._cachedParentMeasure.width)}set thumbWidth(t){this._thumbWidth.toString(this._host)!==t&&this._thumbWidth.fromString(t)&&this._markAsDirty()}get minimum(){return this._minimum}set minimum(t){this._minimum!==t&&(this._minimum=t,this._markAsDirty(),this.value=Math.max(Math.min(this.value,this._maximum),this._minimum))}get maximum(){return this._maximum}set maximum(t){this._maximum!==t&&(this._maximum=t,this._markAsDirty(),this.value=Math.max(Math.min(this.value,this._maximum),this._minimum))}get value(){return this._value}set value(t){t=Math.max(Math.min(t,this._maximum),this._minimum),this._value!==t&&(this._value=t,this._markAsDirty(),this.onValueChangedObservable.notifyObservers(this._value))}get isVertical(){return this._isVertical}set isVertical(t){this._isVertical!==t&&(this._isVertical=t,this._markAsDirty())}get isThumbClamped(){return this._isThumbClamped}set isThumbClamped(t){this._isThumbClamped!==t&&(this._isThumbClamped=t,this._markAsDirty())}constructor(t){super(t),this.name=t,this._thumbWidth=new p(20,p.UNITMODE_PIXEL,!1),this._minimum=0,this._maximum=100,this._value=50,this._isVertical=!1,this._barOffset=new p(5,p.UNITMODE_PIXEL,!1),this._isThumbClamped=!1,this._displayThumb=!0,this._step=0,this._lastPointerDownId=-1,this._effectiveBarOffset=0,this.onValueChangedObservable=new T,this._pointerIsDown=!1,this.isPointerBlocker=!0}_getTypeName(){return"BaseSlider"}_getThumbPosition(){return this.isVertical?(this.maximum-this.value)/(this.maximum-this.minimum)*this._backgroundBoxLength:(this.value-this.minimum)/(this.maximum-this.minimum)*this._backgroundBoxLength}_getThumbThickness(t){let e=0;switch(t){case"circle":this._thumbWidth.isPixel?e=Math.max(this._thumbWidth.getValue(this._host),this._backgroundBoxThickness):e=this._backgroundBoxThickness*this._thumbWidth.getValue(this._host);break;case"rectangle":this._thumbWidth.isPixel?e=Math.min(this._thumbWidth.getValue(this._host),this._backgroundBoxThickness):e=this._backgroundBoxThickness*this._thumbWidth.getValue(this._host)}return e}_prepareRenderingData(t){if(this._effectiveBarOffset=0,this._renderLeft=this._currentMeasure.left,this._renderTop=this._currentMeasure.top,this._renderWidth=this._currentMeasure.width,this._renderHeight=this._currentMeasure.height,this._backgroundBoxLength=Math.max(this._currentMeasure.width,this._currentMeasure.height),this._backgroundBoxThickness=Math.min(this._currentMeasure.width,this._currentMeasure.height),this._effectiveThumbThickness=this._getThumbThickness(t),this.displayThumb&&(this._backgroundBoxLength-=this._effectiveThumbThickness),this.isVertical&&this._currentMeasure.height<this._currentMeasure.width){console.error("Height should be greater than width");return}this._barOffset.isPixel?this._effectiveBarOffset=Math.min(this._barOffset.getValue(this._host),this._backgroundBoxThickness):this._effectiveBarOffset=this._backgroundBoxThickness*this._barOffset.getValue(this._host),this._backgroundBoxThickness-=this._effectiveBarOffset*2,this.isVertical?(this._renderLeft+=this._effectiveBarOffset,!this.isThumbClamped&&this.displayThumb&&(this._renderTop+=this._effectiveThumbThickness/2),this._renderHeight=this._backgroundBoxLength,this._renderWidth=this._backgroundBoxThickness):(this._renderTop+=this._effectiveBarOffset,!this.isThumbClamped&&this.displayThumb&&(this._renderLeft+=this._effectiveThumbThickness/2),this._renderHeight=this._backgroundBoxThickness,this._renderWidth=this._backgroundBoxLength)}_updateValueFromPointer(t,e){this.rotation!=0&&(this._invertTransformMatrix.transformCoordinates(t,e,this._transformedPosition),t=this._transformedPosition.x,e=this._transformedPosition.y);let i;this._isVertical?i=this._minimum+(1-(e-this._currentMeasure.top)/this._currentMeasure.height)*(this._maximum-this._minimum):i=this._minimum+(t-this._currentMeasure.left)/this._currentMeasure.width*(this._maximum-this._minimum),this.value=this._step?Math.round(i/this._step)*this._step:i}_onPointerDown(t,e,i,s,o){return super._onPointerDown(t,e,i,s,o)?(this.isReadOnly||(this._pointerIsDown=!0,this._updateValueFromPointer(e.x,e.y),this._host._capturingControl[i]=this,this._lastPointerDownId=i),!0):!1}_onPointerMove(t,e,i,s){i==this._lastPointerDownId&&(this._pointerIsDown&&!this.isReadOnly&&this._updateValueFromPointer(e.x,e.y),super._onPointerMove(t,e,i,s))}_onPointerUp(t,e,i,s,o){this._pointerIsDown=!1,delete this._host._capturingControl[i],super._onPointerUp(t,e,i,s,o)}_onCanvasBlur(){this._forcePointerUp(),super._onCanvasBlur()}}n([_()],xt.prototype,"displayThumb",null);n([_()],xt.prototype,"step",null);n([_()],xt.prototype,"barOffset",null);n([_()],xt.prototype,"thumbWidth",null);n([_()],xt.prototype,"minimum",null);n([_()],xt.prototype,"maximum",null);n([_()],xt.prototype,"value",null);n([_()],xt.prototype,"isVertical",null);n([_()],xt.prototype,"isThumbClamped",null);class pe extends xt{get displayValueBar(){return this._displayValueBar}set displayValueBar(t){this._displayValueBar!==t&&(this._displayValueBar=t,this._markAsDirty())}get borderColor(){return this._borderColor}set borderColor(t){this._borderColor!==t&&(this._borderColor=t,this._markAsDirty())}get background(){return this._background}set background(t){this._background!==t&&(this._background=t,this._markAsDirty())}get backgroundGradient(){return this._backgroundGradient}set backgroundGradient(t){this._backgroundGradient!==t&&(this._backgroundGradient=t,this._markAsDirty())}get thumbColor(){return this._thumbColor}set thumbColor(t){this._thumbColor!==t&&(this._thumbColor=t,this._markAsDirty())}get isThumbCircle(){return this._isThumbCircle}set isThumbCircle(t){this._isThumbCircle!==t&&(this._isThumbCircle=t,this._markAsDirty())}constructor(t){super(t),this.name=t,this._background="black",this._borderColor="white",this._thumbColor="",this._isThumbCircle=!1,this._displayValueBar=!0,this._backgroundGradient=null}_getTypeName(){return"Slider"}_getBackgroundColor(t){return this._backgroundGradient?this._backgroundGradient.getCanvasGradient(t):this._background}_draw(t){t.save(),this._applyStates(t),this._prepareRenderingData(this.isThumbCircle?"circle":"rectangle");let e=this._renderLeft,i=this._renderTop;const s=this._renderWidth,o=this._renderHeight;let r=0;this.isThumbClamped&&this.isThumbCircle?(this.isVertical?i+=this._effectiveThumbThickness/2:e+=this._effectiveThumbThickness/2,r=this._backgroundBoxThickness/2):r=(this._effectiveThumbThickness-this._effectiveBarOffset)/2,(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY);const a=this._getThumbPosition();t.fillStyle=this._getBackgroundColor(t),this.isVertical?this.isThumbClamped?this.isThumbCircle?(t.beginPath(),t.arc(e+this._backgroundBoxThickness/2,i,r,Math.PI,2*Math.PI),t.fill(),t.fillRect(e,i,s,o)):t.fillRect(e,i,s,o+this._effectiveThumbThickness):t.fillRect(e,i,s,o):this.isThumbClamped?this.isThumbCircle?(t.beginPath(),t.arc(e+this._backgroundBoxLength,i+this._backgroundBoxThickness/2,r,0,2*Math.PI),t.fill(),t.fillRect(e,i,s,o)):t.fillRect(e,i,s+this._effectiveThumbThickness,o):t.fillRect(e,i,s,o),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),t.fillStyle=this._getColor(t),this._displayValueBar&&(this.isVertical?this.isThumbClamped?this.isThumbCircle?(t.beginPath(),t.arc(e+this._backgroundBoxThickness/2,i+this._backgroundBoxLength,r,0,2*Math.PI),t.fill(),t.fillRect(e,i+a,s,o-a)):t.fillRect(e,i+a,s,o-a+this._effectiveThumbThickness):t.fillRect(e,i+a,s,o-a):(this.isThumbClamped&&this.isThumbCircle&&(t.beginPath(),t.arc(e,i+this._backgroundBoxThickness/2,r,0,2*Math.PI),t.fill()),t.fillRect(e,i,a,o))),t.fillStyle=this._thumbColor||this._getColor(t),this.displayThumb&&((this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowColor=this.shadowColor,t.shadowBlur=this.shadowBlur,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY),this._isThumbCircle?(t.beginPath(),this.isVertical?t.arc(e+this._backgroundBoxThickness/2,i+a,r,0,2*Math.PI):t.arc(e+a,i+this._backgroundBoxThickness/2,r,0,2*Math.PI),t.fill(),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),t.strokeStyle=this._borderColor,t.stroke()):(this.isVertical?t.fillRect(e-this._effectiveBarOffset,this._currentMeasure.top+a,this._currentMeasure.width,this._effectiveThumbThickness):t.fillRect(this._currentMeasure.left+a,this._currentMeasure.top,this._effectiveThumbThickness,this._currentMeasure.height),(this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)&&(t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0),t.strokeStyle=this._borderColor,this.isVertical?t.strokeRect(e-this._effectiveBarOffset,this._currentMeasure.top+a,this._currentMeasure.width,this._effectiveThumbThickness):t.strokeRect(this._currentMeasure.left+a,this._currentMeasure.top,this._effectiveThumbThickness,this._currentMeasure.height))),t.restore()}serialize(t){super.serialize(t),this.backgroundGradient&&(t.backgroundGradient={},this.backgroundGradient.serialize(t.backgroundGradient))}_parseFromContent(t,e){if(super._parseFromContent(t,e),t.backgroundGradient){const i=gt.Instantiate("BABYLON.GUI."+t.backgroundGradient.className);this.backgroundGradient=new i,this.backgroundGradient.parse(t.backgroundGradient)}}}n([_()],pe.prototype,"displayValueBar",null);n([_()],pe.prototype,"borderColor",null);n([_()],pe.prototype,"background",null);n([_()],pe.prototype,"thumbColor",null);n([_()],pe.prototype,"isThumbCircle",null);F("BABYLON.GUI.Slider",pe);class Pi extends ht{get freezeControls(){return this._freezeControls}set freezeControls(t){if(this._freezeControls===t)return;t||this._restoreMeasures(),this._freezeControls=!1;const e=this.host.getSize(),i=e.width,s=e.height,o=this.host.getContext(),r=new j(0,0,i,s);this.host._numLayoutCalls=0,this.host._rootContainer._layout(r,o),t&&(this._updateMeasures(),this._useBuckets()&&this._makeBuckets()),this._freezeControls=t,this.host.markAsDirty()}get bucketWidth(){return this._bucketWidth}get bucketHeight(){return this._bucketHeight}setBucketSizes(t,e){this._bucketWidth=t,this._bucketHeight=e,this._useBuckets()?this._freezeControls&&this._makeBuckets():this._buckets={}}_useBuckets(){return this._bucketWidth>0&&this._bucketHeight>0}_makeBuckets(){this._buckets={},this._bucketLen=Math.ceil(this.widthInPixels/this._bucketWidth),this._dispatchInBuckets(this._children),this._oldLeft=null,this._oldTop=null}_dispatchInBuckets(t){for(let e=0;e<t.length;++e){const i=t[e],s=Math.max(0,Math.floor((i._customData._origLeft-this._customData.origLeft)/this._bucketWidth)),o=Math.floor((i._customData._origLeft-this._customData.origLeft+i._currentMeasure.width-1)/this._bucketWidth),r=Math.floor((i._customData._origTop-this._customData.origTop+i._currentMeasure.height-1)/this._bucketHeight);let a=Math.max(0,Math.floor((i._customData._origTop-this._customData.origTop)/this._bucketHeight));for(;a<=r;){for(let l=s;l<=o;++l){const h=a*this._bucketLen+l;let f=this._buckets[h];f||(f=[],this._buckets[h]=f),f.push(i)}a++}i instanceof ht&&i._children.length>0&&this._dispatchInBuckets(i._children)}}_updateMeasures(){const t=this.leftInPixels|0,e=this.topInPixels|0;this._measureForChildren.left-=t,this._measureForChildren.top-=e,this._currentMeasure.left-=t,this._currentMeasure.top-=e,this._customData.origLeftForChildren=this._measureForChildren.left,this._customData.origTopForChildren=this._measureForChildren.top,this._customData.origLeft=this._currentMeasure.left,this._customData.origTop=this._currentMeasure.top,this._updateChildrenMeasures(this._children,t,e)}_updateChildrenMeasures(t,e,i){for(let s=0;s<t.length;++s){const o=t[s];o._currentMeasure.left-=e,o._currentMeasure.top-=i,o._customData._origLeft=o._currentMeasure.left,o._customData._origTop=o._currentMeasure.top,o instanceof ht&&o._children.length>0&&this._updateChildrenMeasures(o._children,e,i)}}_restoreMeasures(){const t=this.leftInPixels|0,e=this.topInPixels|0;this._measureForChildren.left=this._customData.origLeftForChildren+t,this._measureForChildren.top=this._customData.origTopForChildren+e,this._currentMeasure.left=this._customData.origLeft+t,this._currentMeasure.top=this._customData.origTop+e}constructor(t){super(t),this._freezeControls=!1,this._bucketWidth=0,this._bucketHeight=0,this._buckets={}}_getTypeName(){return"ScrollViewerWindow"}_additionalProcessing(t,e){super._additionalProcessing(t,e),this._parentMeasure=t,this._measureForChildren.left=this._currentMeasure.left,this._measureForChildren.top=this._currentMeasure.top,this._measureForChildren.width=t.width,this._measureForChildren.height=t.height}_layout(t,e){return this._freezeControls?(this.invalidateRect(),!1):super._layout(t,e)}_scrollChildren(t,e,i){for(let s=0;s<t.length;++s){const o=t[s];o._currentMeasure.left=o._customData._origLeft+e,o._currentMeasure.top=o._customData._origTop+i,o._isClipped=!1,o instanceof ht&&o._children.length>0&&this._scrollChildren(o._children,e,i)}}_scrollChildrenWithBuckets(t,e,i,s){const o=Math.max(0,Math.floor(-t/this._bucketWidth)),r=Math.floor((-t+this._parentMeasure.width-1)/this._bucketWidth),a=Math.floor((-e+this._parentMeasure.height-1)/this._bucketHeight);let l=Math.max(0,Math.floor(-e/this._bucketHeight));for(;l<=a;){for(let h=o;h<=r;++h){const f=l*this._bucketLen+h,d=this._buckets[f];if(d)for(let u=0;u<d.length;++u){const I=d[u];I._currentMeasure.left=I._customData._origLeft+i,I._currentMeasure.top=I._customData._origTop+s,I._isClipped=!1}}l++}}_draw(t,e){if(!this._freezeControls){super._draw(t,e);return}this._localDraw(t),this.clipChildren&&this._clipForChildren(t);const i=this.leftInPixels|0,s=this.topInPixels|0;this._useBuckets()?this._oldLeft!==null&&this._oldTop!==null?(this._scrollChildrenWithBuckets(this._oldLeft,this._oldTop,i,s),this._scrollChildrenWithBuckets(i,s,i,s)):this._scrollChildren(this._children,i,s):this._scrollChildren(this._children,i,s),this._oldLeft=i,this._oldTop=s;for(const o of this._children)o._intersectsRect(this._parentMeasure)&&o._render(t,this._parentMeasure)}_postMeasure(){if(this._freezeControls){super._postMeasure();return}let t=this.parentClientWidth,e=this.parentClientHeight;for(const i of this.children)!i.isVisible||i.notRenderable||(i.horizontalAlignment===c.HORIZONTAL_ALIGNMENT_CENTER&&i._offsetLeft(this._currentMeasure.left-i._currentMeasure.left),i.verticalAlignment===c.VERTICAL_ALIGNMENT_CENTER&&i._offsetTop(this._currentMeasure.top-i._currentMeasure.top),t=Math.max(t,i._currentMeasure.left-this._currentMeasure.left+i._currentMeasure.width+i.paddingRightInPixels),e=Math.max(e,i._currentMeasure.top-this._currentMeasure.top+i._currentMeasure.height+i.paddingBottomInPixels));this._currentMeasure.width!==t&&(this._width.updateInPlace(t,p.UNITMODE_PIXEL),this._currentMeasure.width=t,this._rebuildLayout=!0,this._isDirty=!0),this._currentMeasure.height!==e&&(this._height.updateInPlace(e,p.UNITMODE_PIXEL),this._currentMeasure.height=e,this._rebuildLayout=!0,this._isDirty=!0),super._postMeasure()}}class ve extends xt{get borderColor(){return this._borderColor}set borderColor(t){this._borderColor!==t&&(this._borderColor=t,this._markAsDirty())}get background(){return this._background}set background(t){this._background!==t&&(this._background=t,this._markAsDirty())}get backgroundGradient(){return this._backgroundGradient}set backgroundGradient(t){this._backgroundGradient!==t&&(this._backgroundGradient=t,this._markAsDirty())}get invertScrollDirection(){return this._invertScrollDirection}set invertScrollDirection(t){this._invertScrollDirection=t}constructor(t){super(t),this.name=t,this._background="black",this._borderColor="white",this._tempMeasure=new j(0,0,0,0),this._invertScrollDirection=!1,this._backgroundGradient=null}_getTypeName(){return"Scrollbar"}_getThumbThickness(){let t=0;return this._thumbWidth.isPixel?t=this._thumbWidth.getValue(this._host):t=this._backgroundBoxThickness*this._thumbWidth.getValue(this._host),t}_getBackgroundColor(t){return this._backgroundGradient?this._backgroundGradient.getCanvasGradient(t):this._background}_draw(t){t.save(),this._applyStates(t),this._prepareRenderingData("rectangle");const e=this._renderLeft,i=this._getThumbPosition();t.fillStyle=this._getBackgroundColor(t),t.fillRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height),t.fillStyle=this._getColor(t),this.isVertical?(this._tempMeasure.left=e-this._effectiveBarOffset,this._tempMeasure.top=this._currentMeasure.top+i,this._tempMeasure.width=this._currentMeasure.width,this._tempMeasure.height=this._effectiveThumbThickness):(this._tempMeasure.left=this._currentMeasure.left+i,this._tempMeasure.top=this._currentMeasure.top,this._tempMeasure.width=this._effectiveThumbThickness,this._tempMeasure.height=this._currentMeasure.height),t.fillRect(this._tempMeasure.left,this._tempMeasure.top,this._tempMeasure.width,this._tempMeasure.height),t.restore()}_updateValueFromPointer(t,e){this.rotation!=0&&(this._invertTransformMatrix.transformCoordinates(t,e,this._transformedPosition),t=this._transformedPosition.x,e=this._transformedPosition.y);const i=this._invertScrollDirection?-1:1;this._first&&(this._first=!1,this._originX=t,this._originY=e,(t<this._tempMeasure.left||t>this._tempMeasure.left+this._tempMeasure.width||e<this._tempMeasure.top||e>this._tempMeasure.top+this._tempMeasure.height)&&(this.isVertical?this.value=this.minimum+(1-(e-this._currentMeasure.top)/this._currentMeasure.height)*(this.maximum-this.minimum):this.value=this.minimum+(t-this._currentMeasure.left)/this._currentMeasure.width*(this.maximum-this.minimum)));let s=0;this.isVertical?s=-((e-this._originY)/(this._currentMeasure.height-this._effectiveThumbThickness)):s=(t-this._originX)/(this._currentMeasure.width-this._effectiveThumbThickness),this.value+=i*s*(this.maximum-this.minimum),this._originX=t,this._originY=e}_onPointerDown(t,e,i,s,o){return this._first=!0,super._onPointerDown(t,e,i,s,o)}serialize(t){super.serialize(t),this.backgroundGradient&&(t.backgroundGradient={},this.backgroundGradient.serialize(t.backgroundGradient))}_parseFromContent(t,e){if(super._parseFromContent(t,e),t.backgroundGradient){const i=gt.Instantiate("BABYLON.GUI."+t.backgroundGradient.className);this.backgroundGradient=new i,this.backgroundGradient.parse(t.backgroundGradient)}}}n([_()],ve.prototype,"borderColor",null);n([_()],ve.prototype,"background",null);n([_()],ve.prototype,"invertScrollDirection",null);F("BABYLON.GUI.Scrollbar",ve);class Me extends xt{get invertScrollDirection(){return this._invertScrollDirection}set invertScrollDirection(t){this._invertScrollDirection=t}get backgroundImage(){return this._backgroundBaseImage}set backgroundImage(t){this._backgroundBaseImage!==t&&(this._backgroundBaseImage=t,this.isVertical&&this.num90RotationInVerticalMode!==0?t.isLoaded?(this._backgroundImage=t._rotate90(this.num90RotationInVerticalMode,!0),this._markAsDirty()):t.onImageLoadedObservable.addOnce(()=>{const e=t._rotate90(this.num90RotationInVerticalMode,!0);this._backgroundImage=e,e.isLoaded||e.onImageLoadedObservable.addOnce(()=>{this._markAsDirty()}),this._markAsDirty()}):(this._backgroundImage=t,t&&!t.isLoaded&&t.onImageLoadedObservable.addOnce(()=>{this._markAsDirty()}),this._markAsDirty()))}get thumbImage(){return this._thumbBaseImage}set thumbImage(t){this._thumbBaseImage!==t&&(this._thumbBaseImage=t,this.isVertical&&this.num90RotationInVerticalMode!==0?t.isLoaded?(this._thumbImage=t._rotate90(-this.num90RotationInVerticalMode,!0),this._markAsDirty()):t.onImageLoadedObservable.addOnce(()=>{const e=t._rotate90(-this.num90RotationInVerticalMode,!0);this._thumbImage=e,e.isLoaded||e.onImageLoadedObservable.addOnce(()=>{this._markAsDirty()}),this._markAsDirty()}):(this._thumbImage=t,t&&!t.isLoaded&&t.onImageLoadedObservable.addOnce(()=>{this._markAsDirty()}),this._markAsDirty()))}get thumbLength(){return this._thumbLength}set thumbLength(t){this._thumbLength!==t&&(this._thumbLength=t,this._markAsDirty())}get thumbHeight(){return this._thumbHeight}set thumbHeight(t){this._thumbLength!==t&&(this._thumbHeight=t,this._markAsDirty())}get barImageHeight(){return this._barImageHeight}set barImageHeight(t){this._barImageHeight!==t&&(this._barImageHeight=t,this._markAsDirty())}constructor(t){super(t),this.name=t,this._thumbLength=.5,this._thumbHeight=1,this._barImageHeight=1,this._tempMeasure=new j(0,0,0,0),this._invertScrollDirection=!1,this.num90RotationInVerticalMode=1}_getTypeName(){return"ImageScrollBar"}_getThumbThickness(){let t=0;return this._thumbWidth.isPixel?t=this._thumbWidth.getValue(this._host):t=this._backgroundBoxThickness*this._thumbWidth.getValue(this._host),t}_draw(t){t.save(),this._applyStates(t),this._prepareRenderingData("rectangle");const e=this._getThumbPosition(),i=this._renderLeft,s=this._renderTop,o=this._renderWidth,r=this._renderHeight;this._backgroundImage&&(this._tempMeasure.copyFromFloats(i,s,o,r),this.isVertical?(this._tempMeasure.copyFromFloats(i+o*(1-this._barImageHeight)*.5,this._currentMeasure.top,o*this._barImageHeight,r),this._tempMeasure.height+=this._effectiveThumbThickness,this._backgroundImage._currentMeasure.copyFrom(this._tempMeasure)):(this._tempMeasure.copyFromFloats(this._currentMeasure.left,s+r*(1-this._barImageHeight)*.5,o,r*this._barImageHeight),this._tempMeasure.width+=this._effectiveThumbThickness,this._backgroundImage._currentMeasure.copyFrom(this._tempMeasure)),this._backgroundImage._draw(t)),this.isVertical?this._tempMeasure.copyFromFloats(i-this._effectiveBarOffset+this._currentMeasure.width*(1-this._thumbHeight)*.5,this._currentMeasure.top+e,this._currentMeasure.width*this._thumbHeight,this._effectiveThumbThickness):this._tempMeasure.copyFromFloats(this._currentMeasure.left+e,this._currentMeasure.top+this._currentMeasure.height*(1-this._thumbHeight)*.5,this._effectiveThumbThickness,this._currentMeasure.height*this._thumbHeight),this._thumbImage&&(this._thumbImage._currentMeasure.copyFrom(this._tempMeasure),this._thumbImage._draw(t)),t.restore()}_updateValueFromPointer(t,e){this.rotation!=0&&(this._invertTransformMatrix.transformCoordinates(t,e,this._transformedPosition),t=this._transformedPosition.x,e=this._transformedPosition.y);const i=this._invertScrollDirection?-1:1;this._first&&(this._first=!1,this._originX=t,this._originY=e,(t<this._tempMeasure.left||t>this._tempMeasure.left+this._tempMeasure.width||e<this._tempMeasure.top||e>this._tempMeasure.top+this._tempMeasure.height)&&(this.isVertical?this.value=this.minimum+(1-(e-this._currentMeasure.top)/this._currentMeasure.height)*(this.maximum-this.minimum):this.value=this.minimum+(t-this._currentMeasure.left)/this._currentMeasure.width*(this.maximum-this.minimum)));let s=0;this.isVertical?s=-((e-this._originY)/(this._currentMeasure.height-this._effectiveThumbThickness)):s=(t-this._originX)/(this._currentMeasure.width-this._effectiveThumbThickness),this.value+=i*s*(this.maximum-this.minimum),this._originX=t,this._originY=e}_onPointerDown(t,e,i,s,o){return this._first=!0,super._onPointerDown(t,e,i,s,o)}}n([_()],Me.prototype,"num90RotationInVerticalMode",void 0);n([_()],Me.prototype,"invertScrollDirection",null);class xe extends Bt{get horizontalBar(){return this._horizontalBar}get verticalBar(){return this._verticalBar}addControl(t){return t?(this._window.addControl(t),this):this}removeControl(t){return this._window.removeControl(t),this}get children(){return this._window.children}_flagDescendantsAsMatrixDirty(){for(const t of this._children)t._markMatrixAsDirty()}get freezeControls(){return this._window.freezeControls}set freezeControls(t){this._window.freezeControls=t}get bucketWidth(){return this._window.bucketWidth}get bucketHeight(){return this._window.bucketHeight}setBucketSizes(t,e){this._window.setBucketSizes(t,e)}get forceHorizontalBar(){return this._forceHorizontalBar}set forceHorizontalBar(t){this._grid.setRowDefinition(1,t?this._barSize:0,!0),this._horizontalBar.isVisible=t,this._forceHorizontalBar=t}get forceVerticalBar(){return this._forceVerticalBar}set forceVerticalBar(t){this._grid.setColumnDefinition(1,t?this._barSize:0,!0),this._verticalBar.isVisible=t,this._forceVerticalBar=t}constructor(t,e){super(t),this._barSize=20,this._pointerIsOver=!1,this._wheelPrecision=.05,this._thumbLength=.5,this._thumbHeight=1,this._barImageHeight=1,this._horizontalBarImageHeight=1,this._verticalBarImageHeight=1,this._oldWindowContentsWidth=0,this._oldWindowContentsHeight=0,this._forceHorizontalBar=!1,this._forceVerticalBar=!1,this._useImageBar=e||!1,this.onDirtyObservable.add(()=>{this._horizontalBarSpace.color=this.color,this._verticalBarSpace.color=this.color,this._dragSpace.color=this.color}),this.onPointerEnterObservable.add(()=>{this._pointerIsOver=!0}),this.onPointerOutObservable.add(()=>{this._pointerIsOver=!1}),this._grid=new dt,this._useImageBar?(this._horizontalBar=new Me,this._verticalBar=new Me):(this._horizontalBar=new ve,this._verticalBar=new ve),this._window=new Pi("scrollViewer_window"),this._window.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,this._window.verticalAlignment=c.VERTICAL_ALIGNMENT_TOP,this._grid.addColumnDefinition(1),this._grid.addColumnDefinition(0,!0),this._grid.addRowDefinition(1),this._grid.addRowDefinition(0,!0),super.addControl(this._grid),this._grid.addControl(this._window,0,0),this._verticalBarSpace=new Bt,this._verticalBarSpace.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,this._verticalBarSpace.verticalAlignment=c.VERTICAL_ALIGNMENT_TOP,this._verticalBarSpace.thickness=1,this._grid.addControl(this._verticalBarSpace,0,1),this._addBar(this._verticalBar,this._verticalBarSpace,!0,Math.PI),this._horizontalBarSpace=new Bt,this._horizontalBarSpace.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,this._horizontalBarSpace.verticalAlignment=c.VERTICAL_ALIGNMENT_TOP,this._horizontalBarSpace.thickness=1,this._grid.addControl(this._horizontalBarSpace,1,0),this._addBar(this._horizontalBar,this._horizontalBarSpace,!1,0),this._dragSpace=new Bt,this._dragSpace.thickness=1,this._grid.addControl(this._dragSpace,1,1),this._useImageBar||(this.barColor="grey",this.barBackground="transparent")}resetWindow(){this._window.width="100%",this._window.height="100%"}_getTypeName(){return"ScrollViewer"}_buildClientSizes(){const t=this.host.idealRatio;this._window.parentClientWidth=this._currentMeasure.width-(this._verticalBar.isVisible||this.forceVerticalBar?this._barSize*t:0)-2*this.thickness,this._window.parentClientHeight=this._currentMeasure.height-(this._horizontalBar.isVisible||this.forceHorizontalBar?this._barSize*t:0)-2*this.thickness,this._clientWidth=this._window.parentClientWidth,this._clientHeight=this._window.parentClientHeight}_additionalProcessing(t,e){super._additionalProcessing(t,e),this._buildClientSizes()}_postMeasure(){super._postMeasure(),this._updateScroller(),this._setWindowPosition(!1)}get wheelPrecision(){return this._wheelPrecision}set wheelPrecision(t){this._wheelPrecision!==t&&(t<0&&(t=0),t>1&&(t=1),this._wheelPrecision=t)}get scrollBackground(){return this._horizontalBarSpace.background}set scrollBackground(t){this._horizontalBarSpace.background!==t&&(this._horizontalBarSpace.background=t,this._verticalBarSpace.background=t)}get barColor(){return this._barColor}set barColor(t){this._barColor!==t&&(this._barColor=t,this._horizontalBar.color=t,this._verticalBar.color=t)}get thumbImage(){return this._barImage}set thumbImage(t){if(this._barImage===t)return;this._barImage=t;const e=this._horizontalBar,i=this._verticalBar;e.thumbImage=t,i.thumbImage=t}get horizontalThumbImage(){return this._horizontalBarImage}set horizontalThumbImage(t){if(this._horizontalBarImage===t)return;this._horizontalBarImage=t;const e=this._horizontalBar;e.thumbImage=t}get verticalThumbImage(){return this._verticalBarImage}set verticalThumbImage(t){if(this._verticalBarImage===t)return;this._verticalBarImage=t;const e=this._verticalBar;e.thumbImage=t}get barSize(){return this._barSize}set barSize(t){this._barSize!==t&&(this._barSize=t,this._markAsDirty(),this._horizontalBar.isVisible&&this._grid.setRowDefinition(1,this._barSize,!0),this._verticalBar.isVisible&&this._grid.setColumnDefinition(1,this._barSize,!0))}get thumbLength(){return this._thumbLength}set thumbLength(t){if(this._thumbLength===t)return;t<=0&&(t=.1),t>1&&(t=1),this._thumbLength=t;const e=this._horizontalBar,i=this._verticalBar;e.thumbLength=t,i.thumbLength=t,this._markAsDirty()}get thumbHeight(){return this._thumbHeight}set thumbHeight(t){if(this._thumbHeight===t)return;t<=0&&(t=.1),t>1&&(t=1),this._thumbHeight=t;const e=this._horizontalBar,i=this._verticalBar;e.thumbHeight=t,i.thumbHeight=t,this._markAsDirty()}get barImageHeight(){return this._barImageHeight}set barImageHeight(t){if(this._barImageHeight===t)return;t<=0&&(t=.1),t>1&&(t=1),this._barImageHeight=t;const e=this._horizontalBar,i=this._verticalBar;e.barImageHeight=t,i.barImageHeight=t,this._markAsDirty()}get horizontalBarImageHeight(){return this._horizontalBarImageHeight}set horizontalBarImageHeight(t){if(this._horizontalBarImageHeight===t)return;t<=0&&(t=.1),t>1&&(t=1),this._horizontalBarImageHeight=t;const e=this._horizontalBar;e.barImageHeight=t,this._markAsDirty()}get verticalBarImageHeight(){return this._verticalBarImageHeight}set verticalBarImageHeight(t){if(this._verticalBarImageHeight===t)return;t<=0&&(t=.1),t>1&&(t=1),this._verticalBarImageHeight=t;const e=this._verticalBar;e.barImageHeight=t,this._markAsDirty()}get barBackground(){return this._barBackground}set barBackground(t){if(this._barBackground===t)return;this._barBackground=t;const e=this._horizontalBar,i=this._verticalBar;e.background=t,i.background=t,this._dragSpace.background=t}get barImage(){return this._barBackgroundImage}set barImage(t){this._barBackgroundImage=t;const e=this._horizontalBar,i=this._verticalBar;e.backgroundImage=t,i.backgroundImage=t}get horizontalBarImage(){return this._horizontalBarBackgroundImage}set horizontalBarImage(t){this._horizontalBarBackgroundImage=t;const e=this._horizontalBar;e.backgroundImage=t}get verticalBarImage(){return this._verticalBarBackgroundImage}set verticalBarImage(t){this._verticalBarBackgroundImage=t;const e=this._verticalBar;e.backgroundImage=t}_setWindowPosition(t=!0){const e=this.host.idealRatio,i=this._window._currentMeasure.width,s=this._window._currentMeasure.height;if(!t&&this._oldWindowContentsWidth===i&&this._oldWindowContentsHeight===s)return;this._oldWindowContentsWidth=i,this._oldWindowContentsHeight=s;const o=this._clientWidth-i,r=this._clientHeight-s,a=this._horizontalBar.value/e*o+"px",l=this._verticalBar.value/e*r+"px";a!==this._window.left&&(this._window.left=a,this.freezeControls||(this._rebuildLayout=!0)),l!==this._window.top&&(this._window.top=l,this.freezeControls||(this._rebuildLayout=!0))}_updateScroller(){const t=this._window._currentMeasure.width,e=this._window._currentMeasure.height;this._horizontalBar.isVisible&&t<=this._clientWidth&&!this.forceHorizontalBar?(this._grid.setRowDefinition(1,0,!0),this._horizontalBar.isVisible=!1,this._horizontalBar.value=0,this._rebuildLayout=!0):!this._horizontalBar.isVisible&&(t>this._clientWidth||this.forceHorizontalBar)&&(this._grid.setRowDefinition(1,this._barSize,!0),this._horizontalBar.isVisible=!0,this._rebuildLayout=!0),this._verticalBar.isVisible&&e<=this._clientHeight&&!this.forceVerticalBar?(this._grid.setColumnDefinition(1,0,!0),this._verticalBar.isVisible=!1,this._verticalBar.value=0,this._rebuildLayout=!0):!this._verticalBar.isVisible&&(e>this._clientHeight||this.forceVerticalBar)&&(this._grid.setColumnDefinition(1,this._barSize,!0),this._verticalBar.isVisible=!0,this._rebuildLayout=!0),this._buildClientSizes();const i=this.host.idealRatio;this._horizontalBar.thumbWidth=this._thumbLength*.9*(this._clientWidth/i)+"px",this._verticalBar.thumbWidth=this._thumbLength*.9*(this._clientHeight/i)+"px"}_link(t){super._link(t),this._attachWheel()}_addBar(t,e,i,s){t.paddingLeft=0,t.width="100%",t.height="100%",t.barOffset=0,t.value=0,t.maximum=1,t.horizontalAlignment=c.HORIZONTAL_ALIGNMENT_CENTER,t.verticalAlignment=c.VERTICAL_ALIGNMENT_CENTER,t.isVertical=i,t.rotation=s,t.isVisible=!1,e.addControl(t),t.onValueChangedObservable.add(()=>{this._setWindowPosition()})}_attachWheel(){!this._host||this._onWheelObserver||(this._onWheelObserver=this.onWheelObservable.add(t=>{!this._pointerIsOver||this.isReadOnly||(this._verticalBar.isVisible==!0&&(t.y<0&&this._verticalBar.value>0?this._verticalBar.value-=this._wheelPrecision:t.y>0&&this._verticalBar.value<this._verticalBar.maximum&&(this._verticalBar.value+=this._wheelPrecision)),this._horizontalBar.isVisible==!0&&(t.x<0&&this._horizontalBar.value<this._horizontalBar.maximum?this._horizontalBar.value+=this._wheelPrecision:t.x>0&&this._horizontalBar.value>0&&(this._horizontalBar.value-=this._wheelPrecision)))}))}_renderHighlightSpecific(t){this.isHighlighted&&(super._renderHighlightSpecific(t),this._grid._renderHighlightSpecific(t),t.restore())}dispose(){this.onWheelObservable.remove(this._onWheelObserver),this._onWheelObserver=null,super.dispose()}}n([_()],xe.prototype,"wheelPrecision",null);n([_()],xe.prototype,"scrollBackground",null);n([_()],xe.prototype,"barColor",null);n([_()],xe.prototype,"barSize",null);n([_()],xe.prototype,"barBackground",null);F("BABYLON.GUI.ScrollViewer",xe);class wi extends Bt{get group(){return this._group}set group(t){this._group!==t&&(this._group=t)}get isActive(){return this._isActive}set isActive(t){var e,i;this._isActive!==t&&(this._isActive=t,this._isActive?(e=this.toActiveAnimation)===null||e===void 0||e.call(this):(i=this.toInactiveAnimation)===null||i===void 0||i.call(this),this._markAsDirty(),this.onIsActiveChangedObservable.notifyObservers(t),this._isActive&&this._host&&this._group&&this._host.executeOnAllControls(s=>{if(s.typeName==="ToggleButton"){if(s===this)return;const o=s;o.group===this.group&&(o.isActive=!1)}}))}constructor(t,e){super(t),this.name=t,this.onIsActiveChangedObservable=new T,this.delegatePickingToChildren=!1,this._isActive=!1,this.group=e??"",this.thickness=0,this.isPointerBlocker=!0;let i=null;this.toActiveAnimation=()=>{this.thickness=1},this.toInactiveAnimation=()=>{this.thickness=0},this.pointerEnterActiveAnimation=()=>{i=this.alpha,this.alpha-=.1},this.pointerOutActiveAnimation=()=>{i!==null&&(this.alpha=i)},this.pointerDownActiveAnimation=()=>{this.scaleX-=.05,this.scaleY-=.05},this.pointerUpActiveAnimation=()=>{this.scaleX+=.05,this.scaleY+=.05},this.pointerEnterInactiveAnimation=()=>{i=this.alpha,this.alpha-=.1},this.pointerOutInactiveAnimation=()=>{i!==null&&(this.alpha=i)},this.pointerDownInactiveAnimation=()=>{this.scaleX-=.05,this.scaleY-=.05},this.pointerUpInactiveAnimation=()=>{this.scaleX+=.05,this.scaleY+=.05}}_getTypeName(){return"ToggleButton"}_processPicking(t,e,i,s,o,r,a,l){if(!this._isEnabled||!this.isHitTestVisible||!this.isVisible||this.notRenderable||!super.contains(t,e))return!1;if(this.delegatePickingToChildren){let h=!1;for(let f=this._children.length-1;f>=0;f--){const d=this._children[f];if(d.isEnabled&&d.isHitTestVisible&&d.isVisible&&!d.notRenderable&&d.contains(t,e)){h=!0;break}}if(!h)return!1}return this._processObservables(s,t,e,i,o,r,a,l),!0}_onPointerEnter(t,e){return super._onPointerEnter(t,e)?(this.isReadOnly||(this._isActive?this.pointerEnterActiveAnimation&&this.pointerEnterActiveAnimation():this.pointerEnterInactiveAnimation&&this.pointerEnterInactiveAnimation()),!0):!1}_onPointerOut(t,e,i=!1){this.isReadOnly||(this._isActive?this.pointerOutActiveAnimation&&this.pointerOutActiveAnimation():this.pointerOutInactiveAnimation&&this.pointerOutInactiveAnimation()),super._onPointerOut(t,e,i)}_onPointerDown(t,e,i,s,o){return super._onPointerDown(t,e,i,s,o)?(this.isReadOnly||(this._isActive?this.pointerDownActiveAnimation&&this.pointerDownActiveAnimation():this.pointerDownInactiveAnimation&&this.pointerDownInactiveAnimation()),!0):!1}_onPointerUp(t,e,i,s,o,r){this.isReadOnly||(this._isActive?this.pointerUpActiveAnimation&&this.pointerUpActiveAnimation():this.pointerUpInactiveAnimation&&this.pointerUpInactiveAnimation()),super._onPointerUp(t,e,i,s,o,r)}}F("BABYLON.GUI.ToggleButton",wi);class qe extends St{constructor(){super(...arguments),this.onKeyPressObservable=new T,this.defaultButtonWidth="40px",this.defaultButtonHeight="40px",this.defaultButtonPaddingLeft="2px",this.defaultButtonPaddingRight="2px",this.defaultButtonPaddingTop="2px",this.defaultButtonPaddingBottom="2px",this.defaultButtonColor="#DDD",this.defaultButtonBackground="#070707",this.shiftButtonColor="#7799FF",this.selectedShiftThickness=1,this.shiftState=0,this._currentlyConnectedInputText=null,this._connectedInputTexts=[],this._onKeyPressObserver=null}_getTypeName(){return"VirtualKeyboard"}_createKey(t,e){const i=Qt.CreateSimpleButton(t,t);return i.width=e&&e.width?e.width:this.defaultButtonWidth,i.height=e&&e.height?e.height:this.defaultButtonHeight,i.color=e&&e.color?e.color:this.defaultButtonColor,i.background=e&&e.background?e.background:this.defaultButtonBackground,i.paddingLeft=e&&e.paddingLeft?e.paddingLeft:this.defaultButtonPaddingLeft,i.paddingRight=e&&e.paddingRight?e.paddingRight:this.defaultButtonPaddingRight,i.paddingTop=e&&e.paddingTop?e.paddingTop:this.defaultButtonPaddingTop,i.paddingBottom=e&&e.paddingBottom?e.paddingBottom:this.defaultButtonPaddingBottom,i.thickness=0,i.isFocusInvisible=!0,i.shadowColor=this.shadowColor,i.shadowBlur=this.shadowBlur,i.shadowOffsetX=this.shadowOffsetX,i.shadowOffsetY=this.shadowOffsetY,i.onPointerUpObservable.add(()=>{this.onKeyPressObservable.notifyObservers(t)}),i}addKeysRow(t,e){const i=new St;i.isVertical=!1,i.isFocusInvisible=!0;let s=null;for(let o=0;o<t.length;o++){let r=null;e&&e.length===t.length&&(r=e[o]);const a=this._createKey(t[o],r);(!s||a.heightInPixels>s.heightInPixels)&&(s=a),i.addControl(a)}i.height=s?s.height:this.defaultButtonHeight,this.addControl(i)}applyShiftState(t){if(this.children)for(let e=0;e<this.children.length;e++){const i=this.children[e];if(!i||!i.children)continue;const s=i;for(let o=0;o<s.children.length;o++){const r=s.children[o];if(!r||!r.children[0])continue;const a=r.children[0];a.text==="⇧"&&(r.color=t?this.shiftButtonColor:this.defaultButtonColor,r.thickness=t>1?this.selectedShiftThickness:0),a.text=t>0?a.text.toUpperCase():a.text.toLowerCase()}}}get connectedInputText(){return this._currentlyConnectedInputText}connect(t){if(this._connectedInputTexts.some(o=>o.input===t))return;this._onKeyPressObserver===null&&(this._onKeyPressObserver=this.onKeyPressObservable.add(o=>{if(this._currentlyConnectedInputText){switch(this._currentlyConnectedInputText._host.focusedControl=this._currentlyConnectedInputText,o){case"⇧":this.shiftState++,this.shiftState>2&&(this.shiftState=0),this.applyShiftState(this.shiftState);return;case"←":this._currentlyConnectedInputText instanceof be?this._currentlyConnectedInputText.alternativeProcessKey("Backspace"):this._currentlyConnectedInputText.processKey(8);return;case"↵":this._currentlyConnectedInputText instanceof be?this._currentlyConnectedInputText.alternativeProcessKey("Enter"):this._currentlyConnectedInputText.processKey(13);return}this._currentlyConnectedInputText instanceof be?this._currentlyConnectedInputText.alternativeProcessKey("",this.shiftState?o.toUpperCase():o):this._currentlyConnectedInputText.processKey(-1,this.shiftState?o.toUpperCase():o),this.shiftState===1&&(this.shiftState=0,this.applyShiftState(this.shiftState))}})),this.isVisible=!1,this._currentlyConnectedInputText=t,t._connectedVirtualKeyboard=this;const i=t.onFocusObservable.add(()=>{this._currentlyConnectedInputText=t,t._connectedVirtualKeyboard=this,this.isVisible=!0}),s=t.onBlurObservable.add(()=>{t._connectedVirtualKeyboard=null,this._currentlyConnectedInputText=null,this.isVisible=!1});this._connectedInputTexts.push({input:t,onBlurObserver:s,onFocusObserver:i})}disconnect(t){if(t){const e=this._connectedInputTexts.filter(i=>i.input===t);e.length===1&&(this._removeConnectedInputObservables(e[0]),this._connectedInputTexts=this._connectedInputTexts.filter(i=>i.input!==t),this._currentlyConnectedInputText===t&&(this._currentlyConnectedInputText=null))}else this._connectedInputTexts.forEach(e=>{this._removeConnectedInputObservables(e)}),this._connectedInputTexts.length=0;this._connectedInputTexts.length===0&&(this._currentlyConnectedInputText=null,this.onKeyPressObservable.remove(this._onKeyPressObserver),this._onKeyPressObserver=null)}_removeConnectedInputObservables(t){t.input._connectedVirtualKeyboard=null,t.input.onFocusObservable.remove(t.onFocusObserver),t.input.onBlurObservable.remove(t.onBlurObserver)}dispose(){super.dispose(),this.disconnect()}static CreateDefaultLayout(t){const e=new qe(t);return e.addKeysRow(["1","2","3","4","5","6","7","8","9","0","←"]),e.addKeysRow(["q","w","e","r","t","y","u","i","o","p"]),e.addKeysRow(["a","s","d","f","g","h","j","k","l",";","'","↵"]),e.addKeysRow(["⇧","z","x","c","v","b","n","m",",",".","/"]),e.addKeysRow([" "],[{width:"200px"}]),e}_parseFromContent(t,e){super._parseFromContent(t,e);for(const i of this.children)if(i.getClassName()==="StackPanel"){const s=i;for(const o of s.children)o.getClassName()==="Button"&&o.name&&o.onPointerUpObservable.add(()=>{this.onKeyPressObservable.notifyObservers(o.name)})}}}F("BABYLON.GUI.VirtualKeyboard",qe);class Pt extends c{get displayMinorLines(){return this._displayMinorLines}set displayMinorLines(t){this._displayMinorLines!==t&&(this._displayMinorLines=t,this._markAsDirty())}get displayMajorLines(){return this._displayMajorLines}set displayMajorLines(t){this._displayMajorLines!==t&&(this._displayMajorLines=t,this._markAsDirty())}get background(){return this._background}set background(t){this._background!==t&&(this._background=t,this._markAsDirty())}get cellWidth(){return this._cellWidth}set cellWidth(t){this._cellWidth=t,this._markAsDirty()}get cellHeight(){return this._cellHeight}set cellHeight(t){this._cellHeight=t,this._markAsDirty()}get minorLineTickness(){return this._minorLineTickness}set minorLineTickness(t){this._minorLineTickness=t,this._markAsDirty()}get minorLineColor(){return this._minorLineColor}set minorLineColor(t){this._minorLineColor=t,this._markAsDirty()}get majorLineTickness(){return this._majorLineTickness}set majorLineTickness(t){this._majorLineTickness=t,this._markAsDirty()}get majorLineColor(){return this._majorLineColor}set majorLineColor(t){this._majorLineColor=t,this._markAsDirty()}get majorLineFrequency(){return this._majorLineFrequency}set majorLineFrequency(t){this._majorLineFrequency=t,this._markAsDirty()}constructor(t){super(t),this.name=t,this._cellWidth=20,this._cellHeight=20,this._minorLineTickness=1,this._minorLineColor="DarkGray",this._majorLineTickness=2,this._majorLineColor="White",this._majorLineFrequency=5,this._background="Black",this._displayMajorLines=!0,this._displayMinorLines=!0}_draw(t){if(t.save(),this._applyStates(t),this._isEnabled){this._background&&(t.fillStyle=this._background,t.fillRect(this._currentMeasure.left,this._currentMeasure.top,this._currentMeasure.width,this._currentMeasure.height));const e=this._currentMeasure.width/this._cellWidth,i=this._currentMeasure.height/this._cellHeight,s=this._currentMeasure.left+this._currentMeasure.width/2,o=this._currentMeasure.top+this._currentMeasure.height/2;if(this._displayMinorLines){t.strokeStyle=this._minorLineColor,t.lineWidth=this._minorLineTickness;for(let r=-e/2+1;r<e/2;r++){const a=s+r*this.cellWidth;t.beginPath(),t.moveTo(a,this._currentMeasure.top),t.lineTo(a,this._currentMeasure.top+this._currentMeasure.height),t.stroke()}for(let r=-i/2+1;r<i/2;r++){const a=o+r*this.cellHeight;t.beginPath(),t.moveTo(this._currentMeasure.left,a),t.lineTo(this._currentMeasure.left+this._currentMeasure.width,a),t.stroke()}}if(this._displayMajorLines){t.strokeStyle=this._majorLineColor,t.lineWidth=this._majorLineTickness;for(let r=-e/2+this._majorLineFrequency;r<e/2;r+=this._majorLineFrequency){const a=s+r*this.cellWidth;t.beginPath(),t.moveTo(a,this._currentMeasure.top),t.lineTo(a,this._currentMeasure.top+this._currentMeasure.height),t.stroke()}for(let r=-i/2+this._majorLineFrequency;r<i/2;r+=this._majorLineFrequency){const a=o+r*this.cellHeight;t.moveTo(this._currentMeasure.left,a),t.lineTo(this._currentMeasure.left+this._currentMeasure.width,a),t.closePath(),t.stroke()}}}t.restore()}_getTypeName(){return"DisplayGrid"}}n([_()],Pt.prototype,"displayMinorLines",null);n([_()],Pt.prototype,"displayMajorLines",null);n([_()],Pt.prototype,"background",null);n([_()],Pt.prototype,"cellWidth",null);n([_()],Pt.prototype,"cellHeight",null);n([_()],Pt.prototype,"minorLineTickness",null);n([_()],Pt.prototype,"minorLineColor",null);n([_()],Pt.prototype,"majorLineTickness",null);n([_()],Pt.prototype,"majorLineColor",null);n([_()],Pt.prototype,"majorLineFrequency",null);F("BABYLON.GUI.DisplayGrid",Pt);class ci extends xt{get displayThumb(){return this._displayThumb&&this.thumbImage!=null}set displayThumb(t){this._displayThumb!==t&&(this._displayThumb=t,this._markAsDirty())}get backgroundImage(){return this._backgroundImage}set backgroundImage(t){this._backgroundImage!==t&&(this._backgroundImage=t,t&&!t.isLoaded&&t.onImageLoadedObservable.addOnce(()=>this._markAsDirty()),this._markAsDirty())}get valueBarImage(){return this._valueBarImage}set valueBarImage(t){this._valueBarImage!==t&&(this._valueBarImage=t,t&&!t.isLoaded&&t.onImageLoadedObservable.addOnce(()=>this._markAsDirty()),this._markAsDirty())}get thumbImage(){return this._thumbImage}set thumbImage(t){this._thumbImage!==t&&(this._thumbImage=t,t&&!t.isLoaded&&t.onImageLoadedObservable.addOnce(()=>this._markAsDirty()),this._markAsDirty())}constructor(t){super(t),this.name=t,this._tempMeasure=new j(0,0,0,0)}_getTypeName(){return"ImageBasedSlider"}_draw(t){t.save(),this._applyStates(t),this._prepareRenderingData("rectangle");const e=this._getThumbPosition(),i=this._renderLeft,s=this._renderTop,o=this._renderWidth,r=this._renderHeight;this._backgroundImage&&(this._tempMeasure.copyFromFloats(i,s,o,r),this.isThumbClamped&&this.displayThumb&&(this.isVertical?this._tempMeasure.height+=this._effectiveThumbThickness:this._tempMeasure.width+=this._effectiveThumbThickness),this._backgroundImage._currentMeasure.copyFrom(this._tempMeasure),this._backgroundImage._draw(t)),this._valueBarImage&&(this.isVertical?this.isThumbClamped&&this.displayThumb?this._tempMeasure.copyFromFloats(i,s+e,o,r-e+this._effectiveThumbThickness):this._tempMeasure.copyFromFloats(i,s+e,o,r-e):this.isThumbClamped&&this.displayThumb?this._tempMeasure.copyFromFloats(i,s,e+this._effectiveThumbThickness/2,r):this._tempMeasure.copyFromFloats(i,s,e,r),this._valueBarImage._currentMeasure.copyFrom(this._tempMeasure),this._valueBarImage._draw(t)),this.displayThumb&&(this.isVertical?this._tempMeasure.copyFromFloats(i-this._effectiveBarOffset,this._currentMeasure.top+e,this._currentMeasure.width,this._effectiveThumbThickness):this._tempMeasure.copyFromFloats(this._currentMeasure.left+e,this._currentMeasure.top,this._effectiveThumbThickness,this._currentMeasure.height),this._thumbImage._currentMeasure.copyFrom(this._tempMeasure),this._thumbImage._draw(t)),t.restore()}serialize(t){super.serialize(t);const e={},i={},s={};this.backgroundImage.serialize(e),this.thumbImage.serialize(i),this.valueBarImage.serialize(s),t.backgroundImage=e,t.thumbImage=i,t.valueBarImage=s}_parseFromContent(t,e){super._parseFromContent(t,e),this.backgroundImage=y.Parse(t.backgroundImage,e),this.thumbImage=y.Parse(t.thumbImage,e),this.valueBarImage=y.Parse(t.valueBarImage,e)}}n([_()],ci.prototype,"displayThumb",null);F("BABYLON.GUI.ImageBasedSlider",ci);c.AddHeader=function(x,t,e,i){const s=new St("panel"),o=i?i.isHorizontal:!0,r=i?i.controlFirst:!0;s.isVertical=!o;const a=new U("header");return a.text=t,a.textHorizontalAlignment=c.HORIZONTAL_ALIGNMENT_LEFT,o?a.width=e:a.height=e,r?(s.addControl(x),s.addControl(a),a.paddingLeft="5px"):(s.addControl(a),s.addControl(x),a.paddingRight="5px"),a.shadowBlur=x.shadowBlur,a.shadowColor=x.shadowColor,a.shadowOffsetX=x.shadowOffsetX,a.shadowOffsetY=x.shadowOffsetY,s};class di{constructor(){this._colorStops=[],this._gradientDirty=!0}_addColorStopsToCanvasGradient(){for(const t of this._colorStops)this._canvasGradient.addColorStop(t.offset,t.color)}getCanvasGradient(t){return(this._gradientDirty||this._context!==t)&&(this._context=t,this._canvasGradient=this._createCanvasGradient(t),this._addColorStopsToCanvasGradient(),this._gradientDirty=!1),this._canvasGradient}addColorStop(t,e){this._colorStops.push({offset:t,color:e}),this._gradientDirty=!0}removeColorStop(t){this._colorStops=this._colorStops.filter(e=>e.offset!==t),this._gradientDirty=!0}clearColorStops(){this._colorStops=[],this._gradientDirty=!0}get colorStops(){return this._colorStops}getClassName(){return"BaseGradient"}serialize(t){t.colorStops=this._colorStops,t.className=this.getClassName()}parse(t){this._colorStops=t.colorStops}}class Fi extends di{constructor(t,e,i,s){super(),this._x0=t??0,this._y0=e??0,this._x1=i??0,this._y1=s??0}_createCanvasGradient(t){return t.createLinearGradient(this._x0,this._y0,this._x1,this._y1)}get x0(){return this._x0}get x1(){return this._x1}get y0(){return this._y0}get y1(){return this._y1}getClassName(){return"LinearGradient"}serialize(t){super.serialize(t),t.x0=this._x0,t.y0=this._y0,t.x1=this._x1,t.y1=this._y1}parse(t){super.parse(t),this._x0=t.x0,this._y0=t.y0,this._x1=t.x1,this._y1=t.y1}}F("BABYLON.GUI.LinearGradient",Fi);class Ei extends di{constructor(t,e,i,s,o,r){super(),this._x0=t??0,this._y0=e??0,this._r0=i??0,this._x1=s??0,this._y1=o??0,this._r1=r??0}_createCanvasGradient(t){return t.createRadialGradient(this._x0,this._y0,this._r0,this._x1,this._y1,this._r1)}get x0(){return this._x0}get x1(){return this._x1}get y0(){return this._y0}get y1(){return this._y1}get r0(){return this._r0}get r1(){return this._r1}getClassName(){return"RadialGradient"}serialize(t){super.serialize(t),t.x0=this._x0,t.y0=this._y0,t.r0=this._r0,t.x1=this._x1,t.y1=this._y1,t.r1=this._r1}parse(t){super.parse(t),this._x0=t.x0,this._y0=t.y0,this._r0=t.r0,this._x1=t.x1,this._y1=t.y1,this._r1=t.r1}}F("BABYLON.GUI.RadialGradient",Ei);class Oi{constructor(t){this._fontFamily="Arial",this._fontStyle="",this._fontWeight="",this._fontSize=new p(18,p.UNITMODE_PIXEL,!1),this.onChangedObservable=new T,this._host=t}get fontSize(){return this._fontSize.toString(this._host)}set fontSize(t){this._fontSize.toString(this._host)!==t&&this._fontSize.fromString(t)&&this.onChangedObservable.notifyObservers(this)}get fontFamily(){return this._fontFamily}set fontFamily(t){this._fontFamily!==t&&(this._fontFamily=t,this.onChangedObservable.notifyObservers(this))}get fontStyle(){return this._fontStyle}set fontStyle(t){this._fontStyle!==t&&(this._fontStyle=t,this.onChangedObservable.notifyObservers(this))}get fontWeight(){return this._fontWeight}set fontWeight(t){this._fontWeight!==t&&(this._fontWeight=t,this.onChangedObservable.notifyObservers(this))}dispose(){this.onChangedObservable.clear()}}class ft extends ni{get numLayoutCalls(){return this._numLayoutCalls}get numRenderCalls(){return this._numRenderCalls}get renderScale(){return this._renderScale}set renderScale(t){t!==this._renderScale&&(this._renderScale=t,this._onResize())}get background(){return this._background}set background(t){this._background!==t&&(this._background=t,this.markAsDirty())}get idealWidth(){return this._idealWidth}set idealWidth(t){this._idealWidth!==t&&(this._idealWidth=t,this.markAsDirty(),this._rootContainer._markAllAsDirty())}get idealHeight(){return this._idealHeight}set idealHeight(t){this._idealHeight!==t&&(this._idealHeight=t,this.markAsDirty(),this._rootContainer._markAllAsDirty())}get useSmallestIdeal(){return this._useSmallestIdeal}set useSmallestIdeal(t){this._useSmallestIdeal!==t&&(this._useSmallestIdeal=t,this.markAsDirty(),this._rootContainer._markAllAsDirty())}get renderAtIdealSize(){return this._renderAtIdealSize}set renderAtIdealSize(t){this._renderAtIdealSize!==t&&(this._renderAtIdealSize=t,this._onResize())}get idealRatio(){let t=0,e=0;return this._idealWidth&&(t=this.getSize().width/this._idealWidth),this._idealHeight&&(e=this.getSize().height/this._idealHeight),this._useSmallestIdeal&&this._idealWidth&&this._idealHeight?window.innerWidth<window.innerHeight?t:e:this._idealWidth?t:this._idealHeight?e:1}get layer(){return this._layerToDispose}get rootContainer(){return this._rootContainer}getChildren(){return[this._rootContainer]}getDescendants(t,e){return this._rootContainer.getDescendants(t,e)}getControlsByType(t){return this._rootContainer.getDescendants(!1,e=>e.typeName===t)}getControlByName(t){return this._getControlByKey("name",t)}_getControlByKey(t,e){return this._rootContainer.getDescendants().find(i=>i[t]===e)||null}get focusedControl(){return this._focusedControl}set focusedControl(t){this._focusedControl!=t&&(this._focusedControl&&this._focusedControl.onBlur(),t&&t.onFocus(),this._focusedControl=t)}get isForeground(){return this.layer?!this.layer.isBackground:!0}set isForeground(t){this.layer&&this.layer.isBackground!==!t&&(this.layer.isBackground=!t)}get clipboardData(){return this._clipboardData}set clipboardData(t){this._clipboardData=t}constructor(t,e=0,i=0,s,o=!1,r=O.NEAREST_SAMPLINGMODE,a=!0){super(t,{width:e,height:i},s,o,r,Rt.TEXTUREFORMAT_RGBA,a),this.onGuiReadyObservable=new T,this._isDirty=!1,this._rootContainer=new ht("root"),this._lastControlOver={},this._lastControlDown={},this._capturingControl={},this._linkedControls=new Array,this._isFullscreen=!1,this._fullscreenViewport=new Qe(0,0,1,1),this._idealWidth=0,this._idealHeight=0,this._useSmallestIdeal=!1,this._renderAtIdealSize=!1,this._blockNextFocusCheck=!1,this._renderScale=1,this._cursorChanged=!1,this._defaultMousePointerId=0,this._rootChildrenHaveChanged=!1,this._capturedPointerIds=new Set,this._numLayoutCalls=0,this._numRenderCalls=0,this._clipboardData="",this.onClipboardObservable=new T,this.onControlPickedObservable=new T,this.onBeginLayoutObservable=new T,this.onEndLayoutObservable=new T,this.onBeginRenderObservable=new T,this.onEndRenderObservable=new T,this.premulAlpha=!1,this.applyYInversionOnUpdate=!0,this.checkPointerEveryFrame=!1,this._useInvalidateRectOptimization=!0,this._invalidatedRectangle=null,this._clearMeasure=new j(0,0,0,0),this._onClipboardCopy=l=>{const h=l,f=new Ye(me.COPY,h);this.onClipboardObservable.notifyObservers(f),h.preventDefault()},this._onClipboardCut=l=>{const h=l,f=new Ye(me.CUT,h);this.onClipboardObservable.notifyObservers(f),h.preventDefault()},this._onClipboardPaste=l=>{const h=l,f=new Ye(me.PASTE,h);this.onClipboardObservable.notifyObservers(f),h.preventDefault()},this.parseContent=this.parseSerializedObject,s=this.getScene(),!(!s||!this._texture)&&(this.applyYInversionOnUpdate=a,this._rootElement=s.getEngine().getInputElement(),this._renderObserver=s.onBeforeCameraRenderObservable.add(l=>this._checkUpdate(l)),this._controlAddedObserver=this._rootContainer.onControlAddedObservable.add(l=>{l&&(this._rootChildrenHaveChanged=!0)}),this._controlRemovedObserver=this._rootContainer.onControlRemovedObservable.add(l=>{l&&(this._rootChildrenHaveChanged=!0)}),this._preKeyboardObserver=s.onPreKeyboardObservable.add(l=>{this._focusedControl&&(l.type===xi.KEYDOWN&&this._focusedControl.processKeyboard(l.event),l.skipOnPointerObservable=!0)}),this._rootContainer._link(this),this.hasAlpha=!0,(!e||!i)&&(this._resizeObserver=s.getEngine().onResizeObservable.add(()=>this._onResize()),this._onResize()),this._texture.isReady=!0)}getClassName(){return"AdvancedDynamicTexture"}executeOnAllControls(t,e){e||(e=this._rootContainer),t(e);for(const i of e.children){if(i.children){this.executeOnAllControls(t,i);continue}t(i)}}get useInvalidateRectOptimization(){return this._useInvalidateRectOptimization}set useInvalidateRectOptimization(t){this._useInvalidateRectOptimization=t}invalidateRect(t,e,i,s){if(this._useInvalidateRectOptimization)if(!this._invalidatedRectangle)this._invalidatedRectangle=new j(t,e,i-t+1,s-e+1);else{const o=Math.ceil(Math.max(this._invalidatedRectangle.left+this._invalidatedRectangle.width-1,i)),r=Math.ceil(Math.max(this._invalidatedRectangle.top+this._invalidatedRectangle.height-1,s));this._invalidatedRectangle.left=Math.floor(Math.min(this._invalidatedRectangle.left,t)),this._invalidatedRectangle.top=Math.floor(Math.min(this._invalidatedRectangle.top,e)),this._invalidatedRectangle.width=o-this._invalidatedRectangle.left+1,this._invalidatedRectangle.height=r-this._invalidatedRectangle.top+1}}markAsDirty(){this._isDirty=!0}createStyle(){return new Oi(this)}addControl(t){return this._rootContainer.addControl(t),this}removeControl(t){return this._rootContainer.removeControl(t),this}moveToNonOverlappedPosition(t,e=1,i=1){let s;if(Array.isArray(t))s=t;else{const o=this.getDescendants(!0);s=t===void 0?o.filter(r=>r.overlapGroup!==void 0):o.filter(r=>r.overlapGroup===t)}s.forEach(o=>{var r;let a=W.Zero();const l=new W(o.centerX,o.centerY);s.forEach(h=>{if(o!==h&&ft._Overlaps(o,h)){const f=l.subtract(new W(h.centerX,h.centerY)),d=f.length();d>0&&(a=a.add(f.normalize().scale(i/d)))}}),a.length()>0&&(a=a.normalize().scale(e*((r=o.overlapDeltaMultiplier)!==null&&r!==void 0?r:1)),o.linkOffsetXInPixels+=a.x,o.linkOffsetYInPixels+=a.y)})}dispose(){const t=this.getScene();t&&(this._rootElement=null,t.onBeforeCameraRenderObservable.remove(this._renderObserver),this._resizeObserver&&t.getEngine().onResizeObservable.remove(this._resizeObserver),this._prePointerObserver&&t.onPrePointerObservable.remove(this._prePointerObserver),this._sceneRenderObserver&&t.onBeforeRenderObservable.remove(this._sceneRenderObserver),this._pointerObserver&&t.onPointerObservable.remove(this._pointerObserver),this._preKeyboardObserver&&t.onPreKeyboardObservable.remove(this._preKeyboardObserver),this._canvasPointerOutObserver&&t.getEngine().onCanvasPointerOutObservable.remove(this._canvasPointerOutObserver),this._canvasBlurObserver&&t.getEngine().onCanvasBlurObservable.remove(this._canvasBlurObserver),this._controlAddedObserver&&this._rootContainer.onControlAddedObservable.remove(this._controlAddedObserver),this._controlRemovedObserver&&this._rootContainer.onControlRemovedObservable.remove(this._controlRemovedObserver),this._layerToDispose&&(this._layerToDispose.texture=null,this._layerToDispose.dispose(),this._layerToDispose=null),this._rootContainer.dispose(),this.onClipboardObservable.clear(),this.onControlPickedObservable.clear(),this.onBeginRenderObservable.clear(),this.onEndRenderObservable.clear(),this.onBeginLayoutObservable.clear(),this.onEndLayoutObservable.clear(),this.onGuiReadyObservable.clear(),super.dispose())}_onResize(){const t=this.getScene();if(!t)return;const e=t.getEngine(),i=this.getSize();let s=e.getRenderWidth()*this._renderScale,o=e.getRenderHeight()*this._renderScale;this._renderAtIdealSize&&(this._idealWidth?(o=o*this._idealWidth/s,s=this._idealWidth):this._idealHeight&&(s=s*this._idealHeight/o,o=this._idealHeight)),(i.width!==s||i.height!==o)&&(this.scaleTo(s,o),this.markAsDirty(),(this._idealWidth||this._idealHeight)&&this._rootContainer._markAllAsDirty()),this.invalidateRect(0,0,i.width-1,i.height-1)}_getGlobalViewport(){const t=this.getSize(),e=this._fullscreenViewport.toGlobal(t.width,t.height),i=Math.round(e.width*(1/this.rootContainer.scaleX)),s=Math.round(e.height*(1/this.rootContainer.scaleY));return e.x+=(e.width-i)/2,e.y+=(e.height-s)/2,e.width=i,e.height=s,e}getProjectedPosition(t,e){const i=this.getProjectedPositionWithZ(t,e);return new W(i.x,i.y)}getProjectedPositionWithZ(t,e){const i=this.getScene();if(!i)return D.Zero();const s=this._getGlobalViewport(),o=D.Project(t,e,i.getTransformMatrix(),s);return new D(o.x,o.y,o.z)}_checkUpdate(t,e){if(!(this._layerToDispose&&!(t.layerMask&this._layerToDispose.layerMask))){if(this._isFullscreen&&this._linkedControls.length){const i=this.getScene();if(!i)return;const s=this._getGlobalViewport();for(const o of this._linkedControls){if(!o.isVisible)continue;const r=o._linkedMesh;if(!r||r.isDisposed()){gt.SetImmediate(()=>{o.linkWithMesh(null)});continue}const a=r.getBoundingInfo?r.getBoundingInfo().boundingSphere.center:D.ZeroReadOnly,l=D.Project(a,r.getWorldMatrix(),i.getTransformMatrix(),s);if(l.z<0||l.z>1){o.notRenderable=!0;continue}o.notRenderable=!1,this.useInvalidateRectOptimization&&o.invalidateRect(),o._moveToProjectedPosition(l)}}!this._isDirty&&!this._rootContainer.isDirty||(this._isDirty=!1,this._render(e),e||this.update(this.applyYInversionOnUpdate,this.premulAlpha,ft.AllowGPUOptimizations))}}_render(t){var e;const i=this.getSize(),s=i.width,o=i.height,r=this.getContext();if(r.font="18px Arial",r.strokeStyle="white",this.onGuiReadyObservable.hasObservers()&&this._checkGuiIsReady(),this._rootChildrenHaveChanged){const l=(e=this.getScene())===null||e===void 0?void 0:e.activeCamera;l&&(this._rootChildrenHaveChanged=!1,this._checkUpdate(l,!0))}this.onBeginLayoutObservable.notifyObservers(this);const a=new j(0,0,s,o);this._numLayoutCalls=0,this._rootContainer._layout(a,r),this.onEndLayoutObservable.notifyObservers(this),this._isDirty=!1,!t&&(this._invalidatedRectangle?this._clearMeasure.copyFrom(this._invalidatedRectangle):this._clearMeasure.copyFromFloats(0,0,s,o),r.clearRect(this._clearMeasure.left,this._clearMeasure.top,this._clearMeasure.width,this._clearMeasure.height),this._background&&(r.save(),r.fillStyle=this._background,r.fillRect(this._clearMeasure.left,this._clearMeasure.top,this._clearMeasure.width,this._clearMeasure.height),r.restore()),this.onBeginRenderObservable.notifyObservers(this),this._numRenderCalls=0,this._rootContainer._render(r,this._invalidatedRectangle),this.onEndRenderObservable.notifyObservers(this),this._invalidatedRectangle=null)}_changeCursor(t){this._rootElement&&(this._rootElement.style.cursor=t,this._cursorChanged=!0)}_registerLastControlDown(t,e){this._lastControlDown[e]=t,this.onControlPickedObservable.notifyObservers(t)}_doPicking(t,e,i,s,o,r,a,l){const h=this.getScene();if(!h)return;const f=h.getEngine(),d=this.getSize();if(this._isFullscreen){const u=h.cameraToUseForPointers||h.activeCamera;if(!u)return;const I=u.viewport;t=t*(d.width/(f.getRenderWidth()*I.width)),e=e*(d.height/(f.getRenderHeight()*I.height))}if(this._capturingControl[o]){this._capturingControl[o].isPointerBlocker&&(this._shouldBlockPointer=!0),this._capturingControl[o]._processObservables(s,t,e,i,o,r);return}this._cursorChanged=!1,this._rootContainer._processPicking(t,e,i,s,o,r,a,l)||(h.doNotHandleCursors||this._changeCursor(""),s===et.POINTERMOVE&&this._lastControlOver[o]&&(this._lastControlOver[o]._onPointerOut(this._lastControlOver[o],i),delete this._lastControlOver[o])),!this._cursorChanged&&!h.doNotHandleCursors&&this._changeCursor(""),this._manageFocus()}_cleanControlAfterRemovalFromList(t,e){for(const i in t){if(!Object.prototype.hasOwnProperty.call(t,i))continue;t[i]===e&&delete t[i]}}_cleanControlAfterRemoval(t){this._cleanControlAfterRemovalFromList(this._lastControlDown,t),this._cleanControlAfterRemovalFromList(this._lastControlOver,t)}pick(t,e,i=null){this._isFullscreen&&this._scene&&this._translateToPicking(this._scene,new Qe(0,0,0,0),i,t,e)}_translateToPicking(t,e,i,s=t.pointerX,o=t.pointerY){const r=t.cameraToUseForPointers||t.activeCamera,a=t.getEngine(),l=t.cameraToUseForPointers;if(!r)e.x=0,e.y=0,e.width=a.getRenderWidth(),e.height=a.getRenderHeight();else if(r.rigCameras.length){const d=new Qe(0,0,1,1);r.rigCameras.forEach(u=>{u.viewport.toGlobalToRef(a.getRenderWidth(),a.getRenderHeight(),d);const I=s/a.getHardwareScalingLevel()-d.x,k=o/a.getHardwareScalingLevel()-(a.getRenderHeight()-d.y-d.height);I<0||k<0||s>d.width||o>d.height||(t.cameraToUseForPointers=u,e.x=d.x,e.y=d.y,e.width=d.width,e.height=d.height)})}else r.viewport.toGlobalToRef(a.getRenderWidth(),a.getRenderHeight(),e);const h=s/a.getHardwareScalingLevel()-e.x,f=o/a.getHardwareScalingLevel()-(a.getRenderHeight()-e.y-e.height);if(this._shouldBlockPointer=!1,i){const d=i.event.pointerId||this._defaultMousePointerId;this._doPicking(h,f,i,i.type,d,i.event.button,i.event.deltaX,i.event.deltaY),(this._shouldBlockPointer||this._capturingControl[d])&&(i.skipOnPointerObservable=!0)}else this._doPicking(h,f,null,et.POINTERMOVE,this._defaultMousePointerId,0);t.cameraToUseForPointers=l}attach(){const t=this.getScene();if(!t)return;const e=new Qe(0,0,0,0);this._prePointerObserver=t.onPrePointerObservable.add(i=>{if(!(t.isPointerCaptured(i.event.pointerId)&&i.type===et.POINTERUP&&!this._capturedPointerIds.has(i.event.pointerId))&&!(i.type!==et.POINTERMOVE&&i.type!==et.POINTERUP&&i.type!==et.POINTERDOWN&&i.type!==et.POINTERWHEEL)){if(i.type===et.POINTERMOVE){if(t.isPointerCaptured(i.event.pointerId))return;i.event.pointerId&&(this._defaultMousePointerId=i.event.pointerId)}this._translateToPicking(t,e,i)}}),this._attachPickingToSceneRender(t,()=>this._translateToPicking(t,e,null),!1),this._attachToOnPointerOut(t),this._attachToOnBlur(t)}registerClipboardEvents(){self.addEventListener("copy",this._onClipboardCopy,!1),self.addEventListener("cut",this._onClipboardCut,!1),self.addEventListener("paste",this._onClipboardPaste,!1)}unRegisterClipboardEvents(){self.removeEventListener("copy",this._onClipboardCopy),self.removeEventListener("cut",this._onClipboardCut),self.removeEventListener("paste",this._onClipboardPaste)}_transformUvs(t){const e=this.getTextureMatrix();let i;if(e.isIdentityAs3x2())i=t;else{const s=Dt.Matrix[0];e.getRowToRef(0,Dt.Vector4[0]),e.getRowToRef(1,Dt.Vector4[1]),e.getRowToRef(2,Dt.Vector4[2]);const o=Dt.Vector4[0],r=Dt.Vector4[1],a=Dt.Vector4[2];s.setRowFromFloats(0,o.x,o.y,0,0),s.setRowFromFloats(1,r.x,r.y,0,0),s.setRowFromFloats(2,0,0,1,0),s.setRowFromFloats(3,a.x,a.y,0,1),i=Dt.Vector2[0],W.TransformToRef(t,s,i)}if((this.wrapU===O.WRAP_ADDRESSMODE||this.wrapU===O.MIRROR_ADDRESSMODE)&&i.x>1){let s=i.x-Math.trunc(i.x);this.wrapU===O.MIRROR_ADDRESSMODE&&Math.trunc(i.x)%2===1&&(s=1-s),i.x=s}if((this.wrapV===O.WRAP_ADDRESSMODE||this.wrapV===O.MIRROR_ADDRESSMODE)&&i.y>1){let s=i.y-Math.trunc(i.y);this.wrapV===O.MIRROR_ADDRESSMODE&&Math.trunc(i.x)%2===1&&(s=1-s),i.y=s}return i}attachToMesh(t,e=!0){const i=this.getScene();i&&(this._pointerObserver&&i.onPointerObservable.remove(this._pointerObserver),this._pointerObserver=i.onPointerObservable.add(s=>{if(s.type!==et.POINTERMOVE&&s.type!==et.POINTERUP&&s.type!==et.POINTERDOWN&&s.type!==et.POINTERWHEEL)return;s.type===et.POINTERMOVE&&s.event.pointerId&&(this._defaultMousePointerId=s.event.pointerId);const o=s.event.pointerId||this._defaultMousePointerId;if(s.pickInfo&&s.pickInfo.hit&&s.pickInfo.pickedMesh===t){let r=s.pickInfo.getTextureCoordinates();if(r){r=this._transformUvs(r);const a=this.getSize();this._doPicking(r.x*a.width,(this.applyYInversionOnUpdate?1-r.y:r.y)*a.height,s,s.type,o,s.event.button,s.event.deltaX,s.event.deltaY)}}else if(s.type===et.POINTERUP){if(this._lastControlDown[o]&&this._lastControlDown[o]._forcePointerUp(o),delete this._lastControlDown[o],this.focusedControl){const r=this.focusedControl.keepsFocusWith();let a=!0;if(r)for(const l of r){if(this===l._host)continue;const h=l._host;if(h._lastControlOver[o]&&h._lastControlOver[o].isAscendant(l)){a=!1;break}}a&&(this.focusedControl=null)}}else s.type===et.POINTERMOVE&&(this._lastControlOver[o]&&this._lastControlOver[o]._onPointerOut(this._lastControlOver[o],s,!0),delete this._lastControlOver[o])}),t.enablePointerMoveEvents=e,this._attachPickingToSceneRender(i,()=>{const s=this._defaultMousePointerId,o=i==null?void 0:i.pick(i.pointerX,i.pointerY);if(o&&o.hit&&o.pickedMesh===t){let r=o.getTextureCoordinates();if(r){r=this._transformUvs(r);const a=this.getSize();this._doPicking(r.x*a.width,(this.applyYInversionOnUpdate?1-r.y:r.y)*a.height,null,et.POINTERMOVE,s,0)}}else this._lastControlOver[s]&&this._lastControlOver[s]._onPointerOut(this._lastControlOver[s],null,!0),delete this._lastControlOver[s]},!0),this._attachToOnPointerOut(i),this._attachToOnBlur(i))}moveFocusToControl(t){this.focusedControl=t,this._lastPickedControl=t,this._blockNextFocusCheck=!0}_manageFocus(){if(this._blockNextFocusCheck){this._blockNextFocusCheck=!1,this._lastPickedControl=this._focusedControl;return}if(this._focusedControl&&this._focusedControl!==this._lastPickedControl){if(this._lastPickedControl.isFocusInvisible)return;this.focusedControl=null}}_attachPickingToSceneRender(t,e,i){this._sceneRenderObserver=t.onBeforeRenderObservable.add(()=>{this.checkPointerEveryFrame&&(this._linkedControls.length>0||i)&&e()})}_attachToOnPointerOut(t){this._canvasPointerOutObserver=t.getEngine().onCanvasPointerOutObservable.add(e=>{this._lastControlOver[e.pointerId]&&this._lastControlOver[e.pointerId]._onPointerOut(this._lastControlOver[e.pointerId],null),delete this._lastControlOver[e.pointerId],this._lastControlDown[e.pointerId]&&this._lastControlDown[e.pointerId]!==this._capturingControl[e.pointerId]&&(this._lastControlDown[e.pointerId]._forcePointerUp(e.pointerId),delete this._lastControlDown[e.pointerId])})}_attachToOnBlur(t){this._canvasBlurObserver=t.getEngine().onCanvasBlurObservable.add(()=>{Object.entries(this._lastControlDown).forEach(([,e])=>{e._onCanvasBlur()}),this.focusedControl=null,this._lastControlDown={}})}serializeContent(){const t=this.getSize(),e={root:{},width:t.width,height:t.height};return this._rootContainer.serialize(e.root),e}parseSerializedObject(t,e){if(this._rootContainer=c.Parse(t.root,this),e){const i=t.width,s=t.height;typeof i=="number"&&typeof s=="number"&&i>=0&&s>=0?this.scaleTo(i,s):this.scaleTo(1920,1080)}}clone(t){const e=this.getScene();if(!e)return this;const i=this.serializeContent(),s=ft.CreateFullscreenUI(t||"Clone of "+this.name,this.isForeground,e,this.samplingMode);return s.parseSerializedObject(i),s}static async ParseFromSnippetAsync(t,e,i){const s=i??ft.CreateFullscreenUI("ADT from snippet");if(t==="_BLANK")return s;const o=await ft._LoadURLContentAsync(ft.SnippetUrl+"/"+t.replace(/#/g,"/"),!0);return s.parseSerializedObject(o,e),s}parseFromSnippetAsync(t,e){return ft.ParseFromSnippetAsync(t,e,this)}static async ParseFromFileAsync(t,e,i){const s=i??ft.CreateFullscreenUI("ADT from URL"),o=await ft._LoadURLContentAsync(t);return s.parseSerializedObject(o,e),s}parseFromURLAsync(t,e){return ft.ParseFromFileAsync(t,e,this)}static _LoadURLContentAsync(t,e=!1){return t===""?Promise.reject("No URL provided"):new Promise((i,s)=>{const o=new Ii;o.addEventListener("readystatechange",()=>{if(o.readyState==4)if(o.status==200){let r;if(e){const l=JSON.parse(JSON.parse(o.responseText).jsonPayload);r=l.encodedGui?new TextDecoder("utf-8").decode(yi(l.encodedGui)):l.gui}else r=o.responseText;const a=JSON.parse(r);i(a)}else s("Unable to load")}),o.open("GET",t),o.send()})}static _Overlaps(t,e){return!(t.centerX>e.centerX+e.widthInPixels||t.centerX+t.widthInPixels<e.centerX||t.centerY+t.heightInPixels<e.centerY||t.centerY>e.centerY+e.heightInPixels)}static CreateForMesh(t,e=1024,i=1024,s=!0,o=!1,r,a=this._CreateMaterial){const l=Bi(),h=new ft(`AdvancedDynamicTexture for ${t.name} [${l}]`,e,i,t.getScene(),!0,O.TRILINEAR_SAMPLINGMODE,r);return a(t,l,h,o),h.attachToMesh(t,s),h}static _CreateMaterial(t,e,i,s){const o=ri("BABYLON.StandardMaterial");if(!o)throw"StandardMaterial needs to be imported before as it contains a side-effect required by your code.";const r=new o(`AdvancedDynamicTextureMaterial for ${t.name} [${e}]`,t.getScene());r.backFaceCulling=!1,r.diffuseColor=V.Black(),r.specularColor=V.Black(),s?(r.diffuseTexture=i,r.emissiveTexture=i,i.hasAlpha=!0):(r.emissiveTexture=i,r.opacityTexture=i),t.material=r}static CreateForMeshTexture(t,e=1024,i=1024,s=!0,o){const r=new ft(t.name+" AdvancedDynamicTexture",e,i,t.getScene(),!0,O.TRILINEAR_SAMPLINGMODE,o);return r.attachToMesh(t,s),r}static CreateFullscreenUI(t,e=!0,i=null,s=O.BILINEAR_SAMPLINGMODE,o=!1){const r=new ft(t,0,0,i,!1,s),a=r.getScene(),l=new Ci(t+"_layer",null,a,!e);if(l.texture=r,r._layerToDispose=l,r._isFullscreen=!0,o&&a){const h=1/a.getEngine().getHardwareScalingLevel();r._rootContainer.scaleX=h,r._rootContainer.scaleY=h}return r.attach(),r}scale(t){super.scale(t),this.markAsDirty()}scaleTo(t,e){super.scaleTo(t,e),this.markAsDirty()}_checkGuiIsReady(){this.guiIsReady()&&(this.onGuiReadyObservable.notifyObservers(this),this.onGuiReadyObservable.clear())}guiIsReady(){return this._rootContainer.isReady()}}ft.SnippetUrl=Rt.SnippetUrl;ft.AllowGPUOptimizations=!0;const Li="fluentVertexShader",Di=`precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
uniform mat4 world;
uniform mat4 viewProjection;
varying vec2 vUV;
#ifdef BORDER
varying vec2 scaleInfo;
uniform float borderWidth;
uniform vec3 scaleFactor;
#endif
#ifdef HOVERLIGHT
varying vec3 worldPosition;
#endif
void main(void) {
vUV=uv;
#ifdef BORDER
vec3 scale=scaleFactor;
float minScale=min(min(scale.x,scale.y),scale.z);
float maxScale=max(max(scale.x,scale.y),scale.z);
float minOverMiddleScale=minScale/(scale.x+scale.y+scale.z-minScale-maxScale);
float areaYZ=scale.y*scale.z;
float areaXZ=scale.x*scale.z;
float areaXY=scale.x*scale.y;
float scaledBorderWidth=borderWidth; 
if (abs(normal.x)==1.0) 
{
scale.x=scale.y;
scale.y=scale.z;
if (areaYZ>areaXZ && areaYZ>areaXY)
{
scaledBorderWidth*=minOverMiddleScale;
}
}
else if (abs(normal.y)==1.0) 
{
scale.x=scale.z;
if (areaXZ>areaXY && areaXZ>areaYZ)
{
scaledBorderWidth*=minOverMiddleScale;
}
}
else 
{
if (areaXY>areaYZ && areaXY>areaXZ)
{
scaledBorderWidth*=minOverMiddleScale;
}
}
float scaleRatio=min(scale.x,scale.y)/max(scale.x,scale.y);
if (scale.x>scale.y)
{
scaleInfo.x=1.0-(scaledBorderWidth*scaleRatio);
scaleInfo.y=1.0-scaledBorderWidth;
}
else
{
scaleInfo.x=1.0-scaledBorderWidth;
scaleInfo.y=1.0-(scaledBorderWidth*scaleRatio);
} 
#endif 
vec4 worldPos=world*vec4(position,1.0);
#ifdef HOVERLIGHT
worldPosition=worldPos.xyz;
#endif
gl_Position=viewProjection*worldPos;
}
`;st.ShadersStore[Li]=Di;const Qi="fluentPixelShader",Ni=`precision highp float;
varying vec2 vUV;
uniform vec4 albedoColor;
#ifdef INNERGLOW
uniform vec4 innerGlowColor;
#endif
#ifdef BORDER
varying vec2 scaleInfo;
uniform float edgeSmoothingValue;
uniform float borderMinValue;
#endif
#ifdef HOVERLIGHT
varying vec3 worldPosition;
uniform vec3 hoverPosition;
uniform vec4 hoverColor;
uniform float hoverRadius;
#endif
#ifdef TEXTURE
uniform sampler2D albedoSampler;
uniform mat4 textureMatrix;
vec2 finalUV;
#endif
void main(void) {
vec3 albedo=albedoColor.rgb;
float alpha=albedoColor.a;
#ifdef TEXTURE
finalUV=vec2(textureMatrix*vec4(vUV,1.0,0.0));
albedo=texture2D(albedoSampler,finalUV).rgb;
#endif
#ifdef HOVERLIGHT
float pointToHover=(1.0-clamp(length(hoverPosition-worldPosition)/hoverRadius,0.,1.))*hoverColor.a;
albedo=clamp(albedo+hoverColor.rgb*pointToHover,0.,1.);
#else
float pointToHover=1.0;
#endif
#ifdef BORDER 
float borderPower=10.0;
float inverseBorderPower=1.0/borderPower;
vec3 borderColor=albedo*borderPower;
vec2 distanceToEdge;
distanceToEdge.x=abs(vUV.x-0.5)*2.0;
distanceToEdge.y=abs(vUV.y-0.5)*2.0;
float borderValue=max(smoothstep(scaleInfo.x-edgeSmoothingValue,scaleInfo.x+edgeSmoothingValue,distanceToEdge.x),
smoothstep(scaleInfo.y-edgeSmoothingValue,scaleInfo.y+edgeSmoothingValue,distanceToEdge.y));
borderColor=borderColor*borderValue*max(borderMinValue*inverseBorderPower,pointToHover); 
albedo+=borderColor;
alpha=max(alpha,borderValue);
#endif
#ifdef INNERGLOW
vec2 uvGlow=(vUV-vec2(0.5,0.5))*(innerGlowColor.a*2.0);
uvGlow=uvGlow*uvGlow;
uvGlow=uvGlow*uvGlow;
albedo+=mix(vec3(0.0,0.0,0.0),innerGlowColor.rgb,uvGlow.x+uvGlow.y); 
#endif
gl_FragColor=vec4(albedo,alpha);
}`;st.ShadersStore[Qi]=Ni;class Mi extends Wt{constructor(){super(),this.INNERGLOW=!1,this.BORDER=!1,this.HOVERLIGHT=!1,this.TEXTURE=!1,this.rebuild()}}class ct extends zt{constructor(t,e){super(t,e),this.innerGlowColorIntensity=.5,this.innerGlowColor=new V(1,1,1),this.albedoColor=new V(.3,.35,.4),this.renderBorders=!1,this.borderWidth=.5,this.edgeSmoothingValue=.02,this.borderMinValue=.1,this.renderHoverLight=!1,this.hoverRadius=.01,this.hoverColor=new M(.3,.3,.3,1),this.hoverPosition=D.Zero()}needAlphaBlending(){return this.alpha!==1}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(t,e){if(this.isFrozen&&e.effect&&e.effect._wasPreviouslyReady)return!0;e.materialDefines||(e.materialDefines=new Mi);const i=this.getScene(),s=e.materialDefines;if(!this.checkReadyOnEveryCall&&e.effect&&s._renderId===i.getRenderId())return!0;if(s._areTexturesDirty)if(s.INNERGLOW=this.innerGlowColorIntensity>0,s.BORDER=this.renderBorders,s.HOVERLIGHT=this.renderHoverLight,this._albedoTexture)if(this._albedoTexture.isReadyOrNotBlocking())s.TEXTURE=!0;else return!1;else s.TEXTURE=!1;const o=i.getEngine();if(s.isDirty){s.markAsProcessed(),i.resetCachedMaterial();const r=[B.PositionKind];r.push(B.NormalKind),r.push(B.UVKind);const a="fluent",l=["world","viewProjection","innerGlowColor","albedoColor","borderWidth","edgeSmoothingValue","scaleFactor","borderMinValue","hoverColor","hoverPosition","hoverRadius","textureMatrix"],h=["albedoSampler"],f=new Array;L.PrepareUniformsAndSamplersList({uniformsNames:l,uniformBuffersNames:f,samplers:h,defines:s,maxSimultaneousLights:4});const d=s.toString();e.setEffect(i.getEngine().createEffect(a,{attributes:r,uniformsNames:l,uniformBuffersNames:f,samplers:h,defines:d,fallbacks:null,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),s,this._materialContext)}return!e.effect||!e.effect.isReady()?!1:(s._renderId=i.getRenderId(),e.effect._wasPreviouslyReady=!0,!0)}bindForSubMesh(t,e,i){const s=this.getScene(),o=i.materialDefines;if(!o)return;const r=i.effect;if(r){if(this._activeEffect=r,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("viewProjection",s.getTransformMatrix()),this._mustRebind(s,r)&&(this._activeEffect.setColor4("albedoColor",this.albedoColor,this.alpha),o.INNERGLOW&&this._activeEffect.setColor4("innerGlowColor",this.innerGlowColor,this.innerGlowColorIntensity),o.BORDER&&(this._activeEffect.setFloat("borderWidth",this.borderWidth),this._activeEffect.setFloat("edgeSmoothingValue",this.edgeSmoothingValue),this._activeEffect.setFloat("borderMinValue",this.borderMinValue),e.getBoundingInfo().boundingBox.extendSize.multiplyToRef(e.scaling,Dt.Vector3[0]),this._activeEffect.setVector3("scaleFactor",Dt.Vector3[0])),o.HOVERLIGHT&&(this._activeEffect.setDirectColor4("hoverColor",this.hoverColor),this._activeEffect.setFloat("hoverRadius",this.hoverRadius),this._activeEffect.setVector3("hoverPosition",this.hoverPosition)),o.TEXTURE&&this._albedoTexture)){this._activeEffect.setTexture("albedoSampler",this._albedoTexture);const a=this._albedoTexture.getTextureMatrix();this._activeEffect.setMatrix("textureMatrix",a)}this._afterBind(e,this._activeEffect)}}getActiveTextures(){return super.getActiveTextures()}hasTexture(t){return!!super.hasTexture(t)}dispose(t){super.dispose(t)}clone(t){return H.Clone(()=>new ct(t,this.getScene()),this)}serialize(){const t=super.serialize();return t.customType="BABYLON.GUI.FluentMaterial",t}getClassName(){return"FluentMaterial"}static Parse(t,e,i){return H.Parse(()=>new ct(t.name,e),t,e,i)}}n([_(),ke("_markAllSubMeshesAsTexturesDirty")],ct.prototype,"innerGlowColorIntensity",void 0);n([ai()],ct.prototype,"innerGlowColor",void 0);n([ai()],ct.prototype,"albedoColor",void 0);n([_(),ke("_markAllSubMeshesAsTexturesDirty")],ct.prototype,"renderBorders",void 0);n([_()],ct.prototype,"borderWidth",void 0);n([_()],ct.prototype,"edgeSmoothingValue",void 0);n([_()],ct.prototype,"borderMinValue",void 0);n([_(),ke("_markAllSubMeshesAsTexturesDirty")],ct.prototype,"renderHoverLight",void 0);n([_()],ct.prototype,"hoverRadius",void 0);n([_i()],ct.prototype,"hoverColor",void 0);n([ae()],ct.prototype,"hoverPosition",void 0);n([Ti("albedoTexture")],ct.prototype,"_albedoTexture",void 0);n([ke("_markAllSubMeshesAsTexturesAndMiscDirty")],ct.prototype,"albedoTexture",void 0);F("BABYLON.GUI.FluentMaterial",ct);const ki="fluentBackplatePixelShader",Ai=`uniform vec3 cameraPosition;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vColor;
varying vec4 vExtra1;
varying vec4 vExtra2;
varying vec4 vExtra3;
uniform float _Radius_;
uniform float _Line_Width_;
uniform bool _Absolute_Sizes_;
uniform float _Filter_Width_;
uniform vec4 _Base_Color_;
uniform vec4 _Line_Color_;
uniform float _Radius_Top_Left_;
uniform float _Radius_Top_Right_;
uniform float _Radius_Bottom_Left_;
uniform float _Radius_Bottom_Right_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform sampler2D _Blob_Texture_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform float _Rate_;
uniform vec4 _Highlight_Color_;
uniform float _Highlight_Width_;
uniform vec4 _Highlight_Transform_;
uniform float _Highlight_;
uniform float _Iridescence_Intensity_;
uniform float _Iridescence_Edge_Intensity_;
uniform float _Angle_;
uniform float _Fade_Out_;
uniform bool _Reflected_;
uniform float _Frequency_;
uniform float _Vertical_Offset_;
uniform sampler2D _Iridescent_Map_;
uniform bool _Use_Global_Left_Index_;
uniform bool _Use_Global_Right_Index_;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
void Round_Rect_Fragment_B31(
float Radius,
float Line_Width,
vec4 Line_Color,
float Filter_Width,
vec2 UV,
float Line_Visibility,
vec4 Rect_Parms,
vec4 Fill_Color,
out vec4 Color)
{
float d=length(max(abs(UV)-Rect_Parms.xy,0.0));
float dx=max(fwidth(d)*Filter_Width,0.00001);
float g=min(Rect_Parms.z,Rect_Parms.w);
float dgrad=max(fwidth(g)*Filter_Width,0.00001);
float Inside_Rect=clamp(g/dgrad,0.0,1.0);
float inner=clamp((d+dx*0.5-max(Radius-Line_Width,d-dx*0.5))/dx,0.0,1.0);
Color=clamp(mix(Fill_Color,Line_Color,inner),0.0,1.0)*Inside_Rect;
}
void Blob_Fragment_B71(
sampler2D Blob_Texture,
vec4 Blob_Info1,
vec4 Blob_Info2,
out vec4 Blob_Color)
{
float k1=dot(Blob_Info1.xy,Blob_Info1.xy);
float k2=dot(Blob_Info2.xy,Blob_Info2.xy);
vec3 closer=k1<k2 ? vec3(k1,Blob_Info1.z,Blob_Info1.w) : vec3(k2,Blob_Info2.z,Blob_Info2.w);
Blob_Color=closer.z*texture(Blob_Texture,vec2(vec2(sqrt(closer.x),closer.y).x,1.0-vec2(sqrt(closer.x),closer.y).y))*clamp(1.0-closer.x,0.0,1.0);
}
void Line_Fragment_B48(
vec4 Base_Color,
vec4 Highlight_Color,
float Highlight_Width,
vec3 Line_Vertex,
float Highlight,
out vec4 Line_Color)
{
float k2=1.0-clamp(abs(Line_Vertex.y/Highlight_Width),0.0,1.0);
Line_Color=mix(Base_Color,Highlight_Color,Highlight*k2);
}
void Scale_RGB_B54(
vec4 Color,
float Scalar,
out vec4 Result)
{
Result=vec4(Scalar,Scalar,Scalar,1)*Color;
}
void Conditional_Float_B38(
bool Which,
float If_True,
float If_False,
out float Result)
{
Result=Which ? If_True : If_False;
}
void main()
{
float R_Q72;
float G_Q72;
float B_Q72;
float A_Q72;
R_Q72=vColor.r; G_Q72=vColor.g; B_Q72=vColor.b; A_Q72=vColor.a;
vec4 Blob_Color_Q71;
#if BLOB_ENABLE
float k1=dot(vExtra2.xy,vExtra2.xy);
float k2=dot(vExtra3.xy,vExtra3.xy);
vec3 closer=k1<k2 ? vec3(k1,vExtra2.z,vExtra2.w) : vec3(k2,vExtra3.z,vExtra3.w);
Blob_Color_Q71=closer.z*texture(_Blob_Texture_,vec2(vec2(sqrt(closer.x),closer.y).x,1.0-vec2(sqrt(closer.x),closer.y).y))*clamp(1.0-closer.x,0.0,1.0);
#else
Blob_Color_Q71=vec4(0,0,0,0);
#endif
vec4 Line_Color_Q48;
Line_Fragment_B48(_Line_Color_,_Highlight_Color_,_Highlight_Width_,vTangent,_Highlight_,Line_Color_Q48);
float X_Q67;
float Y_Q67;
X_Q67=vUV.x;
Y_Q67=vUV.y;
vec3 Incident_Q66=normalize(vPosition-cameraPosition);
vec3 Reflected_Q60=reflect(Incident_Q66,vBinormal);
float Product_Q63=Y_Q67*_Vertical_Offset_;
float Dot_Q68=dot(Incident_Q66, Reflected_Q60);
float Dot_Q57=dot(vNormal, Incident_Q66);
float Result_Q38;
Conditional_Float_B38(_Reflected_,Dot_Q68,Dot_Q57,Result_Q38);
float Product_Q64=Result_Q38*_Frequency_;
float Sum_Q69=Product_Q64+1.0;
float Product_Q70=Sum_Q69*0.5;
float Sum_Q62=Product_Q63+Product_Q70;
float FractF_Q59=fract(Sum_Q62);
vec2 Vec2_Q65=vec2(FractF_Q59,0.5);
vec4 Color_Q58;
#if IRIDESCENT_MAP_ENABLE
Color_Q58=texture(_Iridescent_Map_,Vec2_Q65);
#else
Color_Q58=vec4(0,0,0,0);
#endif
vec4 Result_Q54;
Scale_RGB_B54(Color_Q58,_Iridescence_Edge_Intensity_,Result_Q54);
vec4 Result_Q55;
Scale_RGB_B54(Color_Q58,_Iridescence_Intensity_,Result_Q55);
vec4 Base_And_Iridescent_Q53;
Base_And_Iridescent_Q53=Line_Color_Q48+vec4(Result_Q54.rgb,0.0);
vec4 Base_And_Iridescent_Q56;
Base_And_Iridescent_Q56=_Base_Color_+vec4(Result_Q55.rgb,0.0);
vec4 Result_Q52=Base_And_Iridescent_Q53; Result_Q52.a=1.0;
vec4 Result_Q35=Blob_Color_Q71+(1.0-Blob_Color_Q71.a)*Base_And_Iridescent_Q56;
vec4 Color_Q31;
Round_Rect_Fragment_B31(R_Q72,G_Q72,Result_Q52,_Filter_Width_,vUV,1.0,vExtra1,Result_Q35,Color_Q31);
vec4 Result_Q47=_Fade_Out_*Color_Q31;
vec4 Out_Color=Result_Q47;
float Clip_Threshold=0.001;
bool To_sRGB=false;
gl_FragColor=Out_Color;
}`;st.ShadersStore[ki]=Ai;const Vi="fluentBackplateVertexShader",zi=`uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
#ifdef TANGENT
attribute vec3 tangent;
#else
const vec3 tangent=vec3(0.);
#endif
uniform float _Radius_;
uniform float _Line_Width_;
uniform bool _Absolute_Sizes_;
uniform float _Filter_Width_;
uniform vec4 _Base_Color_;
uniform vec4 _Line_Color_;
uniform float _Radius_Top_Left_;
uniform float _Radius_Top_Right_;
uniform float _Radius_Bottom_Left_;
uniform float _Radius_Bottom_Right_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform sampler2D _Blob_Texture_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform float _Rate_;
uniform vec4 _Highlight_Color_;
uniform float _Highlight_Width_;
uniform vec4 _Highlight_Transform_;
uniform float _Highlight_;
uniform float _Iridescence_Intensity_;
uniform float _Iridescence_Edge_Intensity_;
uniform float _Angle_;
uniform float _Fade_Out_;
uniform bool _Reflected_;
uniform float _Frequency_;
uniform float _Vertical_Offset_;
uniform sampler2D _Iridescent_Map_;
uniform bool _Use_Global_Left_Index_;
uniform bool _Use_Global_Right_Index_;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vColor;
varying vec4 vExtra1;
varying vec4 vExtra2;
varying vec4 vExtra3;
void Object_To_World_Pos_B115(
vec3 Pos_Object,
out vec3 Pos_World)
{
Pos_World=(world*vec4(Pos_Object,1.0)).xyz;
}
void PickDir_B140(
float Degrees,
vec3 DirX,
vec3 DirY,
out vec3 Dir)
{
float a=Degrees*3.14159/180.0;
Dir=cos(a)*DirX+sin(a)*DirY;
}
void Round_Rect_Vertex_B139(
vec2 UV,
float Radius,
float Margin,
float Anisotropy,
float Gradient1,
float Gradient2,
out vec2 Rect_UV,
out vec4 Rect_Parms,
out vec2 Scale_XY,
out vec2 Line_UV)
{
Scale_XY=vec2(Anisotropy,1.0);
Line_UV=(UV-vec2(0.5,0.5));
Rect_UV=Line_UV*Scale_XY;
Rect_Parms.xy=Scale_XY*0.5-vec2(Radius,Radius)-vec2(Margin,Margin);
Rect_Parms.z=Gradient1; 
Rect_Parms.w=Gradient2;
}
void Line_Vertex_B135(
vec2 Scale_XY,
vec2 UV,
float Time,
float Rate,
vec4 Highlight_Transform,
out vec3 Line_Vertex)
{
float angle2=(Rate*Time)*2.0*3.1416;
float sinAngle2=sin(angle2);
float cosAngle2=cos(angle2);
vec2 xformUV=UV*Highlight_Transform.xy+Highlight_Transform.zw;
Line_Vertex.x=0.0;
Line_Vertex.y=cosAngle2*xformUV.x-sinAngle2*xformUV.y;
Line_Vertex.z=0.0; 
}
void Blob_Vertex_B180(
vec3 Position,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
vec3 Blob_Position,
float Intensity,
float Blob_Near_Size,
float Blob_Far_Size,
float Blob_Near_Distance,
float Blob_Far_Distance,
float Blob_Fade_Length,
float Blob_Pulse,
float Blob_Fade,
out vec4 Blob_Info)
{
vec3 blob=Blob_Position;
vec3 delta=blob-Position;
float dist=dot(Normal,delta);
float lerpValue=clamp((abs(dist)-Blob_Near_Distance)/(Blob_Far_Distance-Blob_Near_Distance),0.0,1.0);
float fadeValue=1.0-clamp((abs(dist)-Blob_Far_Distance)/Blob_Fade_Length,0.0,1.0);
float size=Blob_Near_Size+(Blob_Far_Size-Blob_Near_Size)*lerpValue;
vec2 blobXY=vec2(dot(delta,Tangent),dot(delta,Bitangent))/(0.0001+size);
float Fade=fadeValue*Intensity*Blob_Fade;
float Distance=(lerpValue*0.5+0.5)*(1.0-Blob_Pulse);
Blob_Info=vec4(blobXY.x,blobXY.y,Distance,Fade);
}
void Move_Verts_B129(
float Anisotropy,
vec3 P,
float Radius,
out vec3 New_P,
out vec2 New_UV,
out float Radial_Gradient,
out vec3 Radial_Dir)
{
vec2 UV=P.xy*2.0+0.5;
vec2 center=clamp(UV,0.0,1.0);
vec2 delta=UV-center;
vec2 r2=2.0*vec2(Radius/Anisotropy,Radius);
New_UV=center+r2*(UV-2.0*center+0.5);
New_P=vec3(New_UV-0.5,P.z);
Radial_Gradient=1.0-length(delta)*2.0;
Radial_Dir=vec3(delta*r2,0.0);
}
void Object_To_World_Dir_B132(
vec3 Dir_Object,
out vec3 Binormal_World,
out vec3 Binormal_World_N,
out float Binormal_Length)
{
Binormal_World=(world*vec4(Dir_Object,0.0)).xyz;
Binormal_Length=length(Binormal_World);
Binormal_World_N=Binormal_World/Binormal_Length;
}
void RelativeOrAbsoluteDetail_B147(
float Nominal_Radius,
float Nominal_LineWidth,
bool Absolute_Measurements,
float Height,
out float Radius,
out float Line_Width)
{
float scale=Absolute_Measurements ? 1.0/Height : 1.0;
Radius=Nominal_Radius*scale;
Line_Width=Nominal_LineWidth*scale;
}
void Edge_AA_Vertex_B130(
vec3 Position_World,
vec3 Position_Object,
vec3 Normal_Object,
vec3 Eye,
float Radial_Gradient,
vec3 Radial_Dir,
vec3 Tangent,
out float Gradient1,
out float Gradient2)
{
vec3 I=(Eye-Position_World);
vec3 T=(world* vec4(Tangent,0.0)).xyz;
float g=(dot(T,I)<0.0) ? 0.0 : 1.0;
if (Normal_Object.z==0.0) { 
Gradient1=Position_Object.z>0.0 ? g : 1.0;
Gradient2=Position_Object.z>0.0 ? 1.0 : g;
} else {
Gradient1=g+(1.0-g)*(Radial_Gradient);
Gradient2=1.0;
}
}
void Pick_Radius_B144(
float Radius,
float Radius_Top_Left,
float Radius_Top_Right,
float Radius_Bottom_Left,
float Radius_Bottom_Right,
vec3 Position,
out float Result)
{
bool whichY=Position.y>0.0;
Result=Position.x<0.0 ? (whichY ? Radius_Top_Left : Radius_Bottom_Left) : (whichY ? Radius_Top_Right : Radius_Bottom_Right);
Result*=Radius;
}
void main()
{
vec3 Nrm_World_Q128;
Nrm_World_Q128=normalize((world*vec4(normal,0.0)).xyz);
vec3 Tangent_World_Q131;
vec3 Tangent_World_N_Q131;
float Tangent_Length_Q131;
Tangent_World_Q131=(world*vec4(vec3(1,0,0),0.0)).xyz;
Tangent_Length_Q131=length(Tangent_World_Q131);
Tangent_World_N_Q131=Tangent_World_Q131/Tangent_Length_Q131;
vec3 Binormal_World_Q132;
vec3 Binormal_World_N_Q132;
float Binormal_Length_Q132;
Object_To_World_Dir_B132(vec3(0,1,0),Binormal_World_Q132,Binormal_World_N_Q132,Binormal_Length_Q132);
float Anisotropy_Q133=Tangent_Length_Q131/Binormal_Length_Q132;
vec3 Result_Q177;
Result_Q177=mix(_Blob_Position_,Global_Left_Index_Tip_Position.xyz,float(_Use_Global_Left_Index_));
vec3 Result_Q178;
Result_Q178=mix(_Blob_Position_2_,Global_Right_Index_Tip_Position.xyz,float(_Use_Global_Right_Index_));
float Result_Q144;
Pick_Radius_B144(_Radius_,_Radius_Top_Left_,_Radius_Top_Right_,_Radius_Bottom_Left_,_Radius_Bottom_Right_,position,Result_Q144);
vec3 Dir_Q140;
PickDir_B140(_Angle_,Tangent_World_N_Q131,Binormal_World_N_Q132,Dir_Q140);
float Radius_Q147;
float Line_Width_Q147;
RelativeOrAbsoluteDetail_B147(Result_Q144,_Line_Width_,_Absolute_Sizes_,Binormal_Length_Q132,Radius_Q147,Line_Width_Q147);
vec4 Out_Color_Q145=vec4(Radius_Q147,Line_Width_Q147,0,1);
vec3 New_P_Q129;
vec2 New_UV_Q129;
float Radial_Gradient_Q129;
vec3 Radial_Dir_Q129;
Move_Verts_B129(Anisotropy_Q133,position,Radius_Q147,New_P_Q129,New_UV_Q129,Radial_Gradient_Q129,Radial_Dir_Q129);
vec3 Pos_World_Q115;
Object_To_World_Pos_B115(New_P_Q129,Pos_World_Q115);
vec4 Blob_Info_Q180;
#if BLOB_ENABLE
Blob_Vertex_B180(Pos_World_Q115,Nrm_World_Q128,Tangent_World_N_Q131,Binormal_World_N_Q132,Result_Q177,_Blob_Intensity_,_Blob_Near_Size_,_Blob_Far_Size_,_Blob_Near_Distance_,_Blob_Far_Distance_,_Blob_Fade_Length_,_Blob_Pulse_,_Blob_Fade_,Blob_Info_Q180);
#else
Blob_Info_Q180=vec4(0,0,0,0);
#endif
vec4 Blob_Info_Q181;
#if BLOB_ENABLE_2
Blob_Vertex_B180(Pos_World_Q115,Nrm_World_Q128,Tangent_World_N_Q131,Binormal_World_N_Q132,Result_Q178,_Blob_Intensity_,_Blob_Near_Size_2_,_Blob_Far_Size_,_Blob_Near_Distance_,_Blob_Far_Distance_,_Blob_Fade_Length_,_Blob_Pulse_2_,_Blob_Fade_2_,Blob_Info_Q181);
#else
Blob_Info_Q181=vec4(0,0,0,0);
#endif
float Gradient1_Q130;
float Gradient2_Q130;
#if SMOOTH_EDGES
Edge_AA_Vertex_B130(Pos_World_Q115,position,normal,cameraPosition,Radial_Gradient_Q129,Radial_Dir_Q129,tangent,Gradient1_Q130,Gradient2_Q130);
#else
Gradient1_Q130=1.0;
Gradient2_Q130=1.0;
#endif
vec2 Rect_UV_Q139;
vec4 Rect_Parms_Q139;
vec2 Scale_XY_Q139;
vec2 Line_UV_Q139;
Round_Rect_Vertex_B139(New_UV_Q129,Radius_Q147,0.0,Anisotropy_Q133,Gradient1_Q130,Gradient2_Q130,Rect_UV_Q139,Rect_Parms_Q139,Scale_XY_Q139,Line_UV_Q139);
vec3 Line_Vertex_Q135;
Line_Vertex_B135(Scale_XY_Q139,Line_UV_Q139,0.0,_Rate_,_Highlight_Transform_,Line_Vertex_Q135);
vec3 Position=Pos_World_Q115;
vec3 Normal=Dir_Q140;
vec2 UV=Rect_UV_Q139;
vec3 Tangent=Line_Vertex_Q135;
vec3 Binormal=Nrm_World_Q128;
vec4 Color=Out_Color_Q145;
vec4 Extra1=Rect_Parms_Q139;
vec4 Extra2=Blob_Info_Q180;
vec4 Extra3=Blob_Info_Q181;
gl_Position=viewProjection*vec4(Position,1);
vPosition=Position;
vNormal=Normal;
vUV=UV;
vTangent=Tangent;
vBinormal=Binormal;
vColor=Color;
vExtra1=Extra1;
vExtra2=Extra2;
vExtra3=Extra3;
}`;st.ShadersStore[Vi]=zi;class Wi extends Wt{constructor(){super(),this.BLOB_ENABLE=!0,this.BLOB_ENABLE_2=!0,this.SMOOTH_EDGES=!0,this.IRIDESCENT_MAP_ENABLE=!0,this._needNormals=!0,this.rebuild()}}class Q extends zt{constructor(t,e){super(t,e),this.radius=.03,this.lineWidth=.01,this.absoluteSizes=!1,this._filterWidth=1,this.baseColor=new M(.0392157,.0666667,.207843,1),this.lineColor=new M(.14902,.133333,.384314,1),this.blobIntensity=.98,this.blobFarSize=.04,this.blobNearDistance=0,this.blobFarDistance=.08,this.blobFadeLength=.08,this.blobNearSize=.22,this.blobPulse=0,this.blobFade=0,this.blobNearSize2=.22,this.blobPulse2=0,this.blobFade2=0,this._rate=.135,this.highlightColor=new M(.98,.98,.98,1),this.highlightWidth=.25,this._highlightTransform=new rt(1,1,0,0),this._highlight=1,this.iridescenceIntensity=0,this.iridescenceEdgeIntensity=1,this._angle=-45,this.fadeOut=1,this._reflected=!0,this._frequency=1,this._verticalOffset=0,this.globalLeftIndexTipPosition=D.Zero(),this._globalLeftIndexTipPosition4=rt.Zero(),this.globalRightIndexTipPosition=D.Zero(),this._globalRightIndexTipPosition4=rt.Zero(),this.alphaMode=Rt.ALPHA_DISABLE,this.backFaceCulling=!1,this._blobTexture=new O(Q.BLOB_TEXTURE_URL,this.getScene(),!0,!1,O.NEAREST_SAMPLINGMODE),this._iridescentMap=new O(Q.IM_TEXTURE_URL,this.getScene(),!0,!1,O.NEAREST_SAMPLINGMODE)}needAlphaBlending(){return!1}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(t,e){if(this.isFrozen&&e.effect&&e.effect._wasPreviouslyReady)return!0;e.materialDefines||(e.materialDefines=new Wi);const i=e.materialDefines,s=this.getScene();if(this._isReadyForSubMesh(e))return!0;const o=s.getEngine();if(L.PrepareDefinesForAttributes(t,i,!1,!1),i.isDirty){i.markAsProcessed(),s.resetCachedMaterial();const r=new qt;i.FOG&&r.addFallback(1,"FOG"),L.HandleFallbacksForShadows(i,r),i.IMAGEPROCESSINGPOSTPROCESS=s.imageProcessingConfiguration.applyByPostProcess;const a=[B.PositionKind];i.NORMAL&&a.push(B.NormalKind),i.UV1&&a.push(B.UVKind),i.UV2&&a.push(B.UV2Kind),i.VERTEXCOLOR&&a.push(B.ColorKind),i.TANGENT&&a.push(B.TangentKind),L.PrepareAttributesForInstances(a,i);const l="fluentBackplate",h=i.toString(),f=["world","viewProjection","cameraPosition","_Radius_","_Line_Width_","_Absolute_Sizes_","_Filter_Width_","_Base_Color_","_Line_Color_","_Radius_Top_Left_","_Radius_Top_Right_","_Radius_Bottom_Left_","_Radius_Bottom_Right_","_Blob_Position_","_Blob_Intensity_","_Blob_Near_Size_","_Blob_Far_Size_","_Blob_Near_Distance_","_Blob_Far_Distance_","_Blob_Fade_Length_","_Blob_Pulse_","_Blob_Fade_","_Blob_Texture_","_Blob_Position_2_","_Blob_Near_Size_2_","_Blob_Pulse_2_","_Blob_Fade_2_","_Rate_","_Highlight_Color_","_Highlight_Width_","_Highlight_Transform_","_Highlight_","_Iridescence_Intensity_","_Iridescence_Edge_Intensity_","_Angle_","_Fade_Out_","_Reflected_","_Frequency_","_Vertical_Offset_","_Iridescent_Map_","_Use_Global_Left_Index_","_Use_Global_Right_Index_","Global_Left_Index_Tip_Position","Global_Right_Index_Tip_Position"],d=["_Blob_Texture_","_Iridescent_Map_"],u=new Array;L.PrepareUniformsAndSamplersList({uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:i,maxSimultaneousLights:4}),e.setEffect(s.getEngine().createEffect(l,{attributes:a,uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:h,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),i,this._materialContext)}return!e.effect||!e.effect.isReady()?!1:(i._renderId=s.getRenderId(),e.effect._wasPreviouslyReady=!0,!0)}bindForSubMesh(t,e,i){var s,o;if(!i.materialDefines)return;const a=i.effect;a&&(this._activeEffect=a,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("viewProjection",this.getScene().getTransformMatrix()),this._activeEffect.setVector3("cameraPosition",(o=(s=this.getScene().activeCamera)===null||s===void 0?void 0:s.position)!==null&&o!==void 0?o:D.ZeroReadOnly),this._activeEffect.setFloat("_Radius_",this.radius),this._activeEffect.setFloat("_Line_Width_",this.lineWidth),this._activeEffect.setFloat("_Absolute_Sizes_",this.absoluteSizes?1:0),this._activeEffect.setFloat("_Filter_Width_",this._filterWidth),this._activeEffect.setDirectColor4("_Base_Color_",this.baseColor),this._activeEffect.setDirectColor4("_Line_Color_",this.lineColor),this._activeEffect.setFloat("_Radius_Top_Left_",1),this._activeEffect.setFloat("_Radius_Top_Right_",1),this._activeEffect.setFloat("_Radius_Bottom_Left_",1),this._activeEffect.setFloat("_Radius_Bottom_Right_",1),this._activeEffect.setFloat("_Blob_Intensity_",this.blobIntensity),this._activeEffect.setFloat("_Blob_Near_Size_",this.blobNearSize),this._activeEffect.setFloat("_Blob_Far_Size_",this.blobFarSize),this._activeEffect.setFloat("_Blob_Near_Distance_",this.blobNearDistance),this._activeEffect.setFloat("_Blob_Far_Distance_",this.blobFarDistance),this._activeEffect.setFloat("_Blob_Fade_Length_",this.blobFadeLength),this._activeEffect.setFloat("_Blob_Pulse_",this.blobPulse),this._activeEffect.setFloat("_Blob_Fade_",this.blobFade),this._activeEffect.setTexture("_Blob_Texture_",this._blobTexture),this._activeEffect.setFloat("_Blob_Near_Size_2_",this.blobNearSize2),this._activeEffect.setFloat("_Blob_Pulse_2_",this.blobPulse2),this._activeEffect.setFloat("_Blob_Fade_2_",this.blobFade2),this._activeEffect.setFloat("_Rate_",this._rate),this._activeEffect.setDirectColor4("_Highlight_Color_",this.highlightColor),this._activeEffect.setFloat("_Highlight_Width_",this.highlightWidth),this._activeEffect.setVector4("_Highlight_Transform_",this._highlightTransform),this._activeEffect.setFloat("_Highlight_",this._highlight),this._activeEffect.setFloat("_Iridescence_Intensity_",this.iridescenceIntensity),this._activeEffect.setFloat("_Iridescence_Edge_Intensity_",this.iridescenceEdgeIntensity),this._activeEffect.setFloat("_Angle_",this._angle),this._activeEffect.setFloat("_Fade_Out_",this.fadeOut),this._activeEffect.setFloat("_Reflected_",this._reflected?1:0),this._activeEffect.setFloat("_Frequency_",this._frequency),this._activeEffect.setFloat("_Vertical_Offset_",this._verticalOffset),this._activeEffect.setTexture("_Iridescent_Map_",this._iridescentMap),this._activeEffect.setFloat("_Use_Global_Left_Index_",1),this._activeEffect.setFloat("_Use_Global_Right_Index_",1),this._globalLeftIndexTipPosition4.set(this.globalLeftIndexTipPosition.x,this.globalLeftIndexTipPosition.y,this.globalLeftIndexTipPosition.z,1),this._activeEffect.setVector4("Global_Left_Index_Tip_Position",this._globalLeftIndexTipPosition4),this._globalRightIndexTipPosition4.set(this.globalRightIndexTipPosition.x,this.globalRightIndexTipPosition.y,this.globalRightIndexTipPosition.z,1),this._activeEffect.setVector4("Global_Right_Index_Tip_Position",this._globalRightIndexTipPosition4),this._afterBind(e,this._activeEffect))}getAnimatables(){return[]}dispose(t){super.dispose(t),this._blobTexture.dispose(),this._iridescentMap.dispose()}clone(t){return H.Clone(()=>new Q(t,this.getScene()),this)}serialize(){const t=super.serialize();return t.customType="BABYLON.FluentBackplateMaterial",t}getClassName(){return"FluentBackplateMaterial"}static Parse(t,e,i){return H.Parse(()=>new Q(t.name,e),t,e,i)}}Q.BLOB_TEXTURE_URL="https://assets.babylonjs.com/meshes/MRTK/mrtk-fluent-backplate-blob.png";Q.IM_TEXTURE_URL="https://assets.babylonjs.com/meshes/MRTK/mrtk-fluent-backplate-iridescence.png";n([_()],Q.prototype,"radius",void 0);n([_()],Q.prototype,"lineWidth",void 0);n([_()],Q.prototype,"absoluteSizes",void 0);n([_()],Q.prototype,"baseColor",void 0);n([_()],Q.prototype,"lineColor",void 0);n([_()],Q.prototype,"blobIntensity",void 0);n([_()],Q.prototype,"blobFarSize",void 0);n([_()],Q.prototype,"blobNearDistance",void 0);n([_()],Q.prototype,"blobFarDistance",void 0);n([_()],Q.prototype,"blobFadeLength",void 0);n([_()],Q.prototype,"blobNearSize",void 0);n([_()],Q.prototype,"blobPulse",void 0);n([_()],Q.prototype,"blobFade",void 0);n([_()],Q.prototype,"blobNearSize2",void 0);n([_()],Q.prototype,"blobPulse2",void 0);n([_()],Q.prototype,"blobFade2",void 0);n([_()],Q.prototype,"highlightColor",void 0);n([_()],Q.prototype,"highlightWidth",void 0);n([_()],Q.prototype,"iridescenceIntensity",void 0);n([_()],Q.prototype,"iridescenceEdgeIntensity",void 0);n([_()],Q.prototype,"fadeOut",void 0);n([ae()],Q.prototype,"globalLeftIndexTipPosition",void 0);n([ae()],Q.prototype,"globalRightIndexTipPosition",void 0);F("BABYLON.GUI.FluentBackplateMaterial",Q);const Hi="fluentButtonPixelShader",Gi=`uniform vec3 cameraPosition;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vColor;
varying vec4 vExtra1;
uniform float _Edge_Width_;
uniform vec4 _Edge_Color_;
uniform bool _Relative_Width_;
uniform float _Proximity_Max_Intensity_;
uniform float _Proximity_Far_Distance_;
uniform float _Proximity_Near_Radius_;
uniform float _Proximity_Anisotropy_;
uniform float _Selection_Fuzz_;
uniform float _Selected_;
uniform float _Selection_Fade_;
uniform float _Selection_Fade_Size_;
uniform float _Selected_Distance_;
uniform float _Selected_Fade_Length_;
uniform bool _Blob_Enable_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Inner_Fade_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform sampler2D _Blob_Texture_;
uniform bool _Blob_Enable_2_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Inner_Fade_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform vec3 _Active_Face_Dir_;
uniform vec3 _Active_Face_Up_;
uniform bool Enable_Fade;
uniform float _Fade_Width_;
uniform bool _Smooth_Active_Face_;
uniform bool _Show_Frame_;
uniform bool _Use_Blob_Texture_;
uniform bool Use_Global_Left_Index;
uniform bool Use_Global_Right_Index;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
uniform vec4 Global_Left_Thumb_Tip_Position;
uniform vec4 Global_Right_Thumb_Tip_Position;
uniform float Global_Left_Index_Tip_Proximity;
uniform float Global_Right_Index_Tip_Proximity;
void Holo_Edge_Fragment_B35(
vec4 Edges,
float Edge_Width,
out float NotEdge)
{
vec2 c=vec2(min(Edges.r,Edges.g),min(Edges.b,Edges.a));
vec2 df=fwidth(c)*Edge_Width;
vec2 g=clamp(c/df,0.0,1.0);
NotEdge=g.x*g.y;
}
void Blob_Fragment_B39(
vec2 UV,
vec3 Blob_Info,
sampler2D Blob_Texture,
out vec4 Blob_Color)
{
float k=dot(UV,UV);
Blob_Color=Blob_Info.y*texture(Blob_Texture,vec2(vec2(sqrt(k),Blob_Info.x).x,1.0-vec2(sqrt(k),Blob_Info.x).y))*(1.0-clamp(k,0.0,1.0));
}
vec2 FilterStep(vec2 Edge,vec2 X)
{
vec2 dX=max(fwidth(X),vec2(0.00001,0.00001));
return clamp( (X+dX-max(Edge,X-dX))/(dX*2.0),0.0,1.0);
}
void Wireframe_Fragment_B59(
vec3 Widths,
vec2 UV,
float Proximity,
vec4 Edge_Color,
out vec4 Wireframe)
{
vec2 c=min(UV,vec2(1.0,1.0)-UV);
vec2 g=FilterStep(Widths.xy*0.5,c); 
Wireframe=(1.0-min(g.x,g.y))*Proximity*Edge_Color;
}
void Proximity_B53(
vec3 Proximity_Center,
vec3 Proximity_Center_2,
float Proximity_Max_Intensity,
float Proximity_Near_Radius,
vec3 Position,
vec3 Show_Selection,
vec4 Extra1,
float Dist_To_Face,
float Intensity,
out float Proximity)
{
vec2 delta1=Extra1.xy;
vec2 delta2=Extra1.zw;
float d2=sqrt(min(dot(delta1,delta1),dot(delta2,delta2))+Dist_To_Face*Dist_To_Face);
Proximity=Intensity*Proximity_Max_Intensity*(1.0-clamp(d2/Proximity_Near_Radius,0.0,1.0))*(1.0-Show_Selection.x)+Show_Selection.x;
}
void To_XYZ_B46(
vec3 Vec3,
out float X,
out float Y,
out float Z)
{
X=Vec3.x;
Y=Vec3.y;
Z=Vec3.z;
}
void main()
{
float NotEdge_Q35;
#if ENABLE_FADE
Holo_Edge_Fragment_B35(vColor,_Fade_Width_,NotEdge_Q35);
#else
NotEdge_Q35=1.0;
#endif
vec4 Blob_Color_Q39;
float k=dot(vUV,vUV);
vec2 blobTextureCoord=vec2(vec2(sqrt(k),vTangent.x).x,1.0-vec2(sqrt(k),vTangent.x).y);
vec4 blobColor=mix(vec4(1.0,1.0,1.0,1.0)*step(1.0-vTangent.x,clamp(sqrt(k)+0.1,0.0,1.0)),texture(_Blob_Texture_,blobTextureCoord),float(_Use_Blob_Texture_));
Blob_Color_Q39=vTangent.y*blobColor*(1.0-clamp(k,0.0,1.0));
float Is_Quad_Q24;
Is_Quad_Q24=vNormal.z;
vec3 Blob_Position_Q41= mix(_Blob_Position_,Global_Left_Index_Tip_Position.xyz,float(Use_Global_Left_Index));
vec3 Blob_Position_Q42= mix(_Blob_Position_2_,Global_Right_Index_Tip_Position.xyz,float(Use_Global_Right_Index));
float X_Q46;
float Y_Q46;
float Z_Q46;
To_XYZ_B46(vBinormal,X_Q46,Y_Q46,Z_Q46);
float Proximity_Q53;
Proximity_B53(Blob_Position_Q41,Blob_Position_Q42,_Proximity_Max_Intensity_,_Proximity_Near_Radius_,vPosition,vBinormal,vExtra1,Y_Q46,Z_Q46,Proximity_Q53);
vec4 Wireframe_Q59;
Wireframe_Fragment_B59(vNormal,vUV,Proximity_Q53,_Edge_Color_,Wireframe_Q59);
vec4 Wire_Or_Blob_Q23=mix(Wireframe_Q59,Blob_Color_Q39,Is_Quad_Q24);
vec4 Result_Q22;
Result_Q22=mix(Wire_Or_Blob_Q23,vec4(0.3,0.3,0.3,0.3),float(_Show_Frame_));
vec4 Final_Color_Q37=NotEdge_Q35*Result_Q22;
vec4 Out_Color=Final_Color_Q37;
float Clip_Threshold=0.0;
bool To_sRGB=false;
gl_FragColor=Out_Color;
}`;st.ShadersStore[Hi]=Gi;const Ui="fluentButtonVertexShader",Yi=`uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 tangent;
attribute vec4 color;
uniform float _Edge_Width_;
uniform vec4 _Edge_Color_;
uniform float _Proximity_Max_Intensity_;
uniform float _Proximity_Far_Distance_;
uniform float _Proximity_Near_Radius_;
uniform float _Proximity_Anisotropy_;
uniform float _Selection_Fuzz_;
uniform float _Selected_;
uniform float _Selection_Fade_;
uniform float _Selection_Fade_Size_;
uniform float _Selected_Distance_;
uniform float _Selected_Fade_Length_;
uniform bool _Blob_Enable_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Inner_Fade_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform sampler2D _Blob_Texture_;
uniform bool _Blob_Enable_2_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Inner_Fade_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform vec3 _Active_Face_Dir_;
uniform vec3 _Active_Face_Up_;
uniform bool _Enable_Fade_;
uniform float _Fade_Width_;
uniform bool _Smooth_Active_Face_;
uniform bool _Show_Frame_;
uniform bool Use_Global_Left_Index;
uniform bool Use_Global_Right_Index;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
uniform vec4 Global_Left_Thumb_Tip_Position;
uniform vec4 Global_Right_Thumb_Tip_Position;
uniform float Global_Left_Index_Tip_Proximity;
uniform float Global_Right_Index_Tip_Proximity;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vColor;
varying vec4 vExtra1;
void Blob_Vertex_B47(
vec3 Position,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
vec3 Blob_Position,
float Intensity,
float Blob_Near_Size,
float Blob_Far_Size,
float Blob_Near_Distance,
float Blob_Far_Distance,
vec4 Vx_Color,
vec2 UV,
vec3 Face_Center,
vec2 Face_Size,
vec2 In_UV,
float Blob_Fade_Length,
float Selection_Fade,
float Selection_Fade_Size,
float Inner_Fade,
vec3 Active_Face_Center,
float Blob_Pulse,
float Blob_Fade,
float Blob_Enabled,
out vec3 Out_Position,
out vec2 Out_UV,
out vec3 Blob_Info)
{
float blobSize,fadeIn;
vec3 Hit_Position;
Blob_Info=vec3(0.0,0.0,0.0);
float Hit_Distance=dot(Blob_Position-Face_Center,Normal);
Hit_Position=Blob_Position-Hit_Distance*Normal;
float absD=abs(Hit_Distance);
float lerpVal=clamp((absD-Blob_Near_Distance)/(Blob_Far_Distance-Blob_Near_Distance),0.0,1.0);
fadeIn=1.0-clamp((absD-Blob_Far_Distance)/Blob_Fade_Length,0.0,1.0);
float innerFade=1.0-clamp(-Hit_Distance/Inner_Fade,0.0,1.0);
float farClip=clamp(1.0-step(Blob_Far_Distance+Blob_Fade_Length,absD),0.0,1.0);
float size=mix(Blob_Near_Size,Blob_Far_Size,lerpVal)*farClip;
blobSize=mix(size,Selection_Fade_Size,Selection_Fade)*innerFade*Blob_Enabled;
Blob_Info.x=lerpVal*0.5+0.5;
Blob_Info.y=fadeIn*Intensity*(1.0-Selection_Fade)*Blob_Fade;
Blob_Info.x*=(1.0-Blob_Pulse);
vec3 delta=Hit_Position-Face_Center;
vec2 blobCenterXY=vec2(dot(delta,Tangent),dot(delta,Bitangent));
vec2 quadUVin=2.0*UV-1.0; 
vec2 blobXY=blobCenterXY+quadUVin*blobSize;
vec2 blobClipped=clamp(blobXY,-Face_Size*0.5,Face_Size*0.5);
vec2 blobUV=(blobClipped-blobCenterXY)/max(blobSize,0.0001)*2.0;
vec3 blobCorner=Face_Center+blobClipped.x*Tangent+blobClipped.y*Bitangent;
Out_Position=mix(Position,blobCorner,Vx_Color.rrr);
Out_UV=mix(In_UV,blobUV,Vx_Color.rr);
}
vec2 ProjectProximity(
vec3 blobPosition,
vec3 position,
vec3 center,
vec3 dir,
vec3 xdir,
vec3 ydir,
out float vdistance
)
{
vec3 delta=blobPosition-position;
vec2 xy=vec2(dot(delta,xdir),dot(delta,ydir));
vdistance=abs(dot(delta,dir));
return xy;
}
void Proximity_Vertex_B66(
vec3 Blob_Position,
vec3 Blob_Position_2,
vec3 Active_Face_Center,
vec3 Active_Face_Dir,
vec3 Position,
float Proximity_Far_Distance,
float Relative_Scale,
float Proximity_Anisotropy,
vec3 Up,
out vec4 Extra1,
out float Distance_To_Face,
out float Intensity)
{
vec3 Active_Face_Dir_X=normalize(cross(Active_Face_Dir,Up));
vec3 Active_Face_Dir_Y=cross(Active_Face_Dir,Active_Face_Dir_X);
float distz1,distz2;
Extra1.xy=ProjectProximity(Blob_Position,Position,Active_Face_Center,Active_Face_Dir,Active_Face_Dir_X*Proximity_Anisotropy,Active_Face_Dir_Y,distz1)/Relative_Scale;
Extra1.zw=ProjectProximity(Blob_Position_2,Position,Active_Face_Center,Active_Face_Dir,Active_Face_Dir_X*Proximity_Anisotropy,Active_Face_Dir_Y,distz2)/Relative_Scale;
Distance_To_Face=dot(Active_Face_Dir,Position-Active_Face_Center);
Intensity=1.0-clamp(min(distz1,distz2)/Proximity_Far_Distance,0.0,1.0);
}
void Holo_Edge_Vertex_B44(
vec3 Incident,
vec3 Normal,
vec2 UV,
vec3 Tangent,
vec3 Bitangent,
bool Smooth_Active_Face,
float Active,
out vec4 Holo_Edges)
{
float NdotI=dot(Incident,Normal);
vec2 flip=(UV-vec2(0.5,0.5));
float udot=dot(Incident,Tangent)*flip.x*NdotI;
float uval=1.0-float(udot>0.0);
float vdot=-dot(Incident,Bitangent)*flip.y*NdotI;
float vval=1.0-float(vdot>0.0);
float Smooth_And_Active=step(1.0,float(Smooth_Active_Face && Active>0.0));
uval=mix(uval,max(1.0,uval),Smooth_And_Active); 
vval=mix(vval,max(1.0,vval),Smooth_And_Active);
Holo_Edges=vec4(1.0,1.0,1.0,1.0)-vec4(uval*UV.x,uval*(1.0-UV.x),vval*UV.y,vval*(1.0-UV.y));
}
void Object_To_World_Pos_B13(
vec3 Pos_Object,
out vec3 Pos_World)
{
Pos_World=(world*vec4(Pos_Object,1.0)).xyz;
}
void Choose_Blob_B38(
vec4 Vx_Color,
vec3 Position1,
vec3 Position2,
bool Blob_Enable_1,
bool Blob_Enable_2,
float Near_Size_1,
float Near_Size_2,
float Blob_Inner_Fade_1,
float Blob_Inner_Fade_2,
float Blob_Pulse_1,
float Blob_Pulse_2,
float Blob_Fade_1,
float Blob_Fade_2,
out vec3 Position,
out float Near_Size,
out float Inner_Fade,
out float Blob_Enable,
out float Fade,
out float Pulse)
{
Position=Position1*(1.0-Vx_Color.g)+Vx_Color.g*Position2;
float b1=float(Blob_Enable_1);
float b2=float(Blob_Enable_2);
Blob_Enable=b1+(b2-b1)*Vx_Color.g;
Pulse=Blob_Pulse_1*(1.0-Vx_Color.g)+Vx_Color.g*Blob_Pulse_2;
Fade=Blob_Fade_1*(1.0-Vx_Color.g)+Vx_Color.g*Blob_Fade_2;
Near_Size=Near_Size_1*(1.0-Vx_Color.g)+Vx_Color.g*Near_Size_2;
Inner_Fade=Blob_Inner_Fade_1*(1.0-Vx_Color.g)+Vx_Color.g*Blob_Inner_Fade_2;
}
void Wireframe_Vertex_B51(
vec3 Position,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
float Edge_Width,
vec2 Face_Size,
out vec3 Wire_Vx_Pos,
out vec2 UV,
out vec2 Widths)
{
Widths.xy=Edge_Width/Face_Size;
float x=dot(Position,Tangent);
float y=dot(Position,Bitangent);
float dx=0.5-abs(x);
float newx=(0.5-dx*Widths.x*2.0)*sign(x);
float dy=0.5-abs(y);
float newy=(0.5-dy*Widths.y*2.0)*sign(y);
Wire_Vx_Pos=Normal*0.5+newx*Tangent+newy*Bitangent;
UV.x=dot(Wire_Vx_Pos,Tangent)+0.5;
UV.y=dot(Wire_Vx_Pos,Bitangent)+0.5;
}
vec2 ramp2(vec2 start,vec2 end,vec2 x)
{
return clamp((x-start)/(end-start),vec2(0.0,0.0),vec2(1.0,1.0));
}
float computeSelection(
vec3 blobPosition,
vec3 normal,
vec3 tangent,
vec3 bitangent,
vec3 faceCenter,
vec2 faceSize,
float selectionFuzz,
float farDistance,
float fadeLength
)
{
vec3 delta=blobPosition-faceCenter;
float absD=abs(dot(delta,normal));
float fadeIn=1.0-clamp((absD-farDistance)/fadeLength,0.0,1.0);
vec2 blobCenterXY=vec2(dot(delta,tangent),dot(delta,bitangent));
vec2 innerFace=faceSize*(1.0-selectionFuzz)*0.5;
vec2 selectPulse=ramp2(-faceSize*0.5,-innerFace,blobCenterXY)-ramp2(innerFace,faceSize*0.5,blobCenterXY);
return selectPulse.x*selectPulse.y*fadeIn;
}
void Selection_Vertex_B48(
vec3 Blob_Position,
vec3 Blob_Position_2,
vec3 Face_Center,
vec2 Face_Size,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
float Selection_Fuzz,
float Selected,
float Far_Distance,
float Fade_Length,
vec3 Active_Face_Dir,
out float Show_Selection)
{
float select1=computeSelection(Blob_Position,Normal,Tangent,Bitangent,Face_Center,Face_Size,Selection_Fuzz,Far_Distance,Fade_Length);
float select2=computeSelection(Blob_Position_2,Normal,Tangent,Bitangent,Face_Center,Face_Size,Selection_Fuzz,Far_Distance,Fade_Length);
float Active=max(0.0,dot(Active_Face_Dir,Normal));
Show_Selection=mix(max(select1,select2),1.0,Selected)*Active;
}
void Proximity_Visibility_B54(
float Selection,
vec3 Proximity_Center,
vec3 Proximity_Center_2,
float Input_Width,
float Proximity_Far_Distance,
float Proximity_Radius,
vec3 Active_Face_Center,
vec3 Active_Face_Dir,
out float Width)
{
vec3 boxEdges=(world*vec4(vec3(0.5,0.5,0.5),0.0)).xyz;
float boxMaxSize=length(boxEdges);
float d1=dot(Proximity_Center-Active_Face_Center,Active_Face_Dir);
vec3 blob1=Proximity_Center-d1*Active_Face_Dir;
float d2=dot(Proximity_Center_2-Active_Face_Center,Active_Face_Dir);
vec3 blob2=Proximity_Center_2-d2*Active_Face_Dir;
vec3 delta1=blob1-Active_Face_Center;
vec3 delta2=blob2-Active_Face_Center;
float dist1=dot(delta1,delta1);
float dist2=dot(delta2,delta2);
float nearestProxDist=sqrt(min(dist1,dist2));
Width=Input_Width*(1.0-step(boxMaxSize+Proximity_Radius,nearestProxDist))*(1.0-step(Proximity_Far_Distance,min(d1,d2))*(1.0-step(0.0001,Selection)));
}
void Object_To_World_Dir_B67(
vec3 Dir_Object,
out vec3 Dir_World)
{
Dir_World=(world*vec4(Dir_Object,0.0)).xyz;
}
void main()
{
vec3 Active_Face_Center_Q49;
Active_Face_Center_Q49=(world*vec4(_Active_Face_Dir_*0.5,1.0)).xyz;
vec3 Blob_Position_Q41= mix(_Blob_Position_,Global_Left_Index_Tip_Position.xyz,float(Use_Global_Left_Index));
vec3 Blob_Position_Q42= mix(_Blob_Position_2_,Global_Right_Index_Tip_Position.xyz,float(Use_Global_Right_Index));
vec3 Active_Face_Dir_Q64=normalize((world*vec4(_Active_Face_Dir_,0.0)).xyz);
float Relative_Scale_Q57;
#if RELATIVE_WIDTH
Relative_Scale_Q57=length((world*vec4(vec3(0,1,0),0.0)).xyz);
#else
Relative_Scale_Q57=1.0;
#endif
vec3 Tangent_World_Q30;
Tangent_World_Q30=(world*vec4(tangent,0.0)).xyz;
vec3 Binormal_World_Q31;
Binormal_World_Q31=(world*vec4((cross(normal,tangent)),0.0)).xyz;
vec3 Normal_World_Q60;
Normal_World_Q60=(world*vec4(normal,0.0)).xyz;
vec3 Result_Q18=0.5*normal;
vec3 Dir_World_Q67;
Object_To_World_Dir_B67(_Active_Face_Up_,Dir_World_Q67);
float Product_Q56=_Edge_Width_*Relative_Scale_Q57;
vec3 Normal_World_N_Q29=normalize(Normal_World_Q60);
vec3 Tangent_World_N_Q28=normalize(Tangent_World_Q30);
vec3 Binormal_World_N_Q32=normalize(Binormal_World_Q31);
vec3 Position_Q38;
float Near_Size_Q38;
float Inner_Fade_Q38;
float Blob_Enable_Q38;
float Fade_Q38;
float Pulse_Q38;
Choose_Blob_B38(color,Blob_Position_Q41,Blob_Position_Q42,_Blob_Enable_,_Blob_Enable_2_,_Blob_Near_Size_,_Blob_Near_Size_2_,_Blob_Inner_Fade_,_Blob_Inner_Fade_2_,_Blob_Pulse_,_Blob_Pulse_2_,_Blob_Fade_,_Blob_Fade_2_,Position_Q38,Near_Size_Q38,Inner_Fade_Q38,Blob_Enable_Q38,Fade_Q38,Pulse_Q38);
vec3 Face_Center_Q33;
Face_Center_Q33=(world*vec4(Result_Q18,1.0)).xyz;
vec2 Face_Size_Q50=vec2(length(Tangent_World_Q30),length(Binormal_World_Q31));
float Show_Selection_Q48;
Selection_Vertex_B48(Blob_Position_Q41,Blob_Position_Q42,Face_Center_Q33,Face_Size_Q50,Normal_World_N_Q29,Tangent_World_N_Q28,Binormal_World_N_Q32,_Selection_Fuzz_,_Selected_,_Selected_Distance_,_Selected_Fade_Length_,Active_Face_Dir_Q64,Show_Selection_Q48);
vec3 Normalized_Q72=normalize(Dir_World_Q67);
float Active_Q34=max(0.0,dot(Active_Face_Dir_Q64,Normal_World_N_Q29));
float Width_Q54;
Proximity_Visibility_B54(Show_Selection_Q48,Blob_Position_Q41,Blob_Position_Q42,Product_Q56,_Proximity_Far_Distance_,_Proximity_Near_Radius_,Active_Face_Center_Q49,Active_Face_Dir_Q64,Width_Q54);
vec3 Wire_Vx_Pos_Q51;
vec2 UV_Q51;
vec2 Widths_Q51;
Wireframe_Vertex_B51(position,normal,tangent,(cross(normal,tangent)),Width_Q54,Face_Size_Q50,Wire_Vx_Pos_Q51,UV_Q51,Widths_Q51);
vec3 Vec3_Q27=vec3(Widths_Q51.x,Widths_Q51.y,color.r);
vec3 Pos_World_Q13;
Object_To_World_Pos_B13(Wire_Vx_Pos_Q51,Pos_World_Q13);
vec3 Incident_Q36=normalize(Pos_World_Q13-cameraPosition);
vec3 Out_Position_Q47;
vec2 Out_UV_Q47;
vec3 Blob_Info_Q47;
Blob_Vertex_B47(Pos_World_Q13,Normal_World_N_Q29,Tangent_World_N_Q28,Binormal_World_N_Q32,Position_Q38,_Blob_Intensity_,Near_Size_Q38,_Blob_Far_Size_,_Blob_Near_Distance_,_Blob_Far_Distance_,color,uv,Face_Center_Q33,Face_Size_Q50,UV_Q51,_Blob_Fade_Length_,_Selection_Fade_,_Selection_Fade_Size_,Inner_Fade_Q38,Active_Face_Center_Q49,Pulse_Q38,Fade_Q38,Blob_Enable_Q38,Out_Position_Q47,Out_UV_Q47,Blob_Info_Q47);
vec4 Extra1_Q66;
float Distance_To_Face_Q66;
float Intensity_Q66;
Proximity_Vertex_B66(Blob_Position_Q41,Blob_Position_Q42,Active_Face_Center_Q49,Active_Face_Dir_Q64,Pos_World_Q13,_Proximity_Far_Distance_,Relative_Scale_Q57,_Proximity_Anisotropy_,Normalized_Q72,Extra1_Q66,Distance_To_Face_Q66,Intensity_Q66);
vec4 Holo_Edges_Q44;
Holo_Edge_Vertex_B44(Incident_Q36,Normal_World_N_Q29,uv,Tangent_World_Q30,Binormal_World_Q31,_Smooth_Active_Face_,Active_Q34,Holo_Edges_Q44);
vec3 Vec3_Q19=vec3(Show_Selection_Q48,Distance_To_Face_Q66,Intensity_Q66);
vec3 Position=Out_Position_Q47;
vec2 UV=Out_UV_Q47;
vec3 Tangent=Blob_Info_Q47;
vec3 Binormal=Vec3_Q19;
vec3 Normal=Vec3_Q27;
vec4 Extra1=Extra1_Q66;
vec4 Color=Holo_Edges_Q44;
gl_Position=viewProjection*vec4(Position,1);
vPosition=Position;
vNormal=Normal;
vUV=UV;
vTangent=Tangent;
vBinormal=Binormal;
vColor=Color;
vExtra1=Extra1;
}`;st.ShadersStore[Ui]=Yi;class Xi extends Wt{constructor(){super(),this.RELATIVE_WIDTH=!0,this.ENABLE_FADE=!0,this._needNormals=!0,this._needUVs=!0,this.rebuild()}}class R extends zt{constructor(t,e){super(t,e),this.edgeWidth=.04,this.edgeColor=new M(.592157,.592157,.592157,1),this.proximityMaxIntensity=.45,this.proximityFarDistance=.16,this.proximityNearRadius=1.5,this.proximityAnisotropy=1,this.selectionFuzz=.5,this.selected=0,this.selectionFade=0,this.selectionFadeSize=.3,this.selectedDistance=.08,this.selectedFadeLength=.08,this.blobIntensity=.5,this.blobFarSize=.05,this.blobNearDistance=0,this.blobFarDistance=.08,this.blobFadeLength=.08,this.leftBlobEnable=!0,this.leftBlobNearSize=.025,this.leftBlobPulse=0,this.leftBlobFade=1,this.leftBlobInnerFade=.01,this.rightBlobEnable=!0,this.rightBlobNearSize=.025,this.rightBlobPulse=0,this.rightBlobFade=1,this.rightBlobInnerFade=.01,this.activeFaceDir=new D(0,0,-1),this.activeFaceUp=new D(0,1,0),this.enableFade=!0,this.fadeWidth=1.5,this.smoothActiveFace=!0,this.showFrame=!1,this.useBlobTexture=!0,this.globalLeftIndexTipPosition=D.Zero(),this.globalRightIndexTipPosition=D.Zero(),this.alphaMode=Rt.ALPHA_ADD,this.disableDepthWrite=!0,this.backFaceCulling=!1,this._blobTexture=new O(R.BLOB_TEXTURE_URL,this.getScene(),!0,!1,O.NEAREST_SAMPLINGMODE)}needAlphaBlending(){return!0}needAlphaTesting(){return!0}getAlphaTestTexture(){return null}isReadyForSubMesh(t,e){if(this.isFrozen&&e.effect&&e.effect._wasPreviouslyReady)return!0;e.materialDefines||(e.materialDefines=new Xi);const i=e.materialDefines,s=this.getScene();if(this._isReadyForSubMesh(e))return!0;const o=s.getEngine();if(L.PrepareDefinesForAttributes(t,i,!0,!1),i.isDirty){i.markAsProcessed(),s.resetCachedMaterial();const r=new qt;i.FOG&&r.addFallback(1,"FOG"),L.HandleFallbacksForShadows(i,r),i.IMAGEPROCESSINGPOSTPROCESS=s.imageProcessingConfiguration.applyByPostProcess;const a=[B.PositionKind];i.NORMAL&&a.push(B.NormalKind),i.UV1&&a.push(B.UVKind),i.UV2&&a.push(B.UV2Kind),i.VERTEXCOLOR&&a.push(B.ColorKind),i.TANGENT&&a.push(B.TangentKind),L.PrepareAttributesForInstances(a,i);const l="fluentButton",h=i.toString(),f=["world","viewProjection","cameraPosition","_Edge_Width_","_Edge_Color_","_Relative_Width_","_Proximity_Max_Intensity_","_Proximity_Far_Distance_","_Proximity_Near_Radius_","_Proximity_Anisotropy_","_Selection_Fuzz_","_Selected_","_Selection_Fade_","_Selection_Fade_Size_","_Selected_Distance_","_Selected_Fade_Length_","_Blob_Enable_","_Blob_Position_","_Blob_Intensity_","_Blob_Near_Size_","_Blob_Far_Size_","_Blob_Near_Distance_","_Blob_Far_Distance_","_Blob_Fade_Length_","_Blob_Inner_Fade_","_Blob_Pulse_","_Blob_Fade_","_Blob_Texture_","_Blob_Enable_2_","_Blob_Position_2_","_Blob_Near_Size_2_","_Blob_Inner_Fade_2_","_Blob_Pulse_2_","_Blob_Fade_2_","_Active_Face_Dir_","_Active_Face_Up_","_Enable_Fade_","_Fade_Width_","_Smooth_Active_Face_","_Show_Frame_","_Use_Blob_Texture_","Use_Global_Left_Index","Use_Global_Right_Index","Global_Left_Index_Tip_Position","Global_Right_Index_Tip_Position","Global_Left_Thumb_Tip_Position","Global_Right_Thumb_Tip_Position","Global_Left_Index_Tip_Proximity","Global_Right_Index_Tip_Proximity"],d=["_Blob_Texture_"],u=new Array;L.PrepareUniformsAndSamplersList({uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:i,maxSimultaneousLights:4}),e.setEffect(s.getEngine().createEffect(l,{attributes:a,uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:h,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),i,this._materialContext)}return!e.effect||!e.effect.isReady()?!1:(i._renderId=s.getRenderId(),e.effect._wasPreviouslyReady=!0,!0)}bindForSubMesh(t,e,i){const s=this.getScene();if(!i.materialDefines)return;const r=i.effect;r&&(this._activeEffect=r,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("viewProjection",s.getTransformMatrix()),this._activeEffect.setVector3("cameraPosition",s.activeCamera.position),this._activeEffect.setTexture("_Blob_Texture_",this._blobTexture),this._activeEffect.setFloat("_Edge_Width_",this.edgeWidth),this._activeEffect.setColor4("_Edge_Color_",new V(this.edgeColor.r,this.edgeColor.g,this.edgeColor.b),this.edgeColor.a),this._activeEffect.setFloat("_Proximity_Max_Intensity_",this.proximityMaxIntensity),this._activeEffect.setFloat("_Proximity_Far_Distance_",this.proximityFarDistance),this._activeEffect.setFloat("_Proximity_Near_Radius_",this.proximityNearRadius),this._activeEffect.setFloat("_Proximity_Anisotropy_",this.proximityAnisotropy),this._activeEffect.setFloat("_Selection_Fuzz_",this.selectionFuzz),this._activeEffect.setFloat("_Selected_",this.selected),this._activeEffect.setFloat("_Selection_Fade_",this.selectionFade),this._activeEffect.setFloat("_Selection_Fade_Size_",this.selectionFadeSize),this._activeEffect.setFloat("_Selected_Distance_",this.selectedDistance),this._activeEffect.setFloat("_Selected_Fade_Length_",this.selectedFadeLength),this._activeEffect.setFloat("_Blob_Enable_",this.leftBlobEnable?1:0),this._activeEffect.setFloat("_Blob_Intensity_",this.blobIntensity),this._activeEffect.setFloat("_Blob_Near_Size_",this.leftBlobNearSize),this._activeEffect.setFloat("_Blob_Far_Size_",this.blobFarSize),this._activeEffect.setFloat("_Blob_Near_Distance_",this.blobNearDistance),this._activeEffect.setFloat("_Blob_Far_Distance_",this.blobFarDistance),this._activeEffect.setFloat("_Blob_Fade_Length_",this.blobFadeLength),this._activeEffect.setFloat("_Blob_Inner_Fade_",this.leftBlobInnerFade),this._activeEffect.setFloat("_Blob_Pulse_",this.leftBlobPulse),this._activeEffect.setFloat("_Blob_Fade_",this.leftBlobFade),this._activeEffect.setFloat("_Blob_Enable_2_",this.rightBlobEnable?1:0),this._activeEffect.setFloat("_Blob_Near_Size_2_",this.rightBlobNearSize),this._activeEffect.setFloat("_Blob_Inner_Fade_2_",this.rightBlobInnerFade),this._activeEffect.setFloat("_Blob_Pulse_2_",this.rightBlobPulse),this._activeEffect.setFloat("_Blob_Fade_2_",this.rightBlobFade),this._activeEffect.setVector3("_Active_Face_Dir_",this.activeFaceDir),this._activeEffect.setVector3("_Active_Face_Up_",this.activeFaceUp),this._activeEffect.setFloat("_Fade_Width_",this.fadeWidth),this._activeEffect.setFloat("_Smooth_Active_Face_",this.smoothActiveFace?1:0),this._activeEffect.setFloat("_Show_Frame_",this.showFrame?1:0),this._activeEffect.setFloat("_Use_Blob_Texture_",this.useBlobTexture?1:0),this._activeEffect.setFloat("Use_Global_Left_Index",1),this._activeEffect.setFloat("Use_Global_Right_Index",1),this._activeEffect.setVector4("Global_Left_Index_Tip_Position",new rt(this.globalLeftIndexTipPosition.x,this.globalLeftIndexTipPosition.y,this.globalLeftIndexTipPosition.z,1)),this._activeEffect.setVector4("Global_Right_Index_Tip_Position",new rt(this.globalRightIndexTipPosition.x,this.globalRightIndexTipPosition.y,this.globalRightIndexTipPosition.z,1)),this._afterBind(e,this._activeEffect))}getAnimatables(){return[]}dispose(t){super.dispose(t)}clone(t){return H.Clone(()=>new R(t,this.getScene()),this)}serialize(){const t=super.serialize();return t.customType="BABYLON.FluentButtonMaterial",t}getClassName(){return"FluentButtonMaterial"}static Parse(t,e,i){return H.Parse(()=>new R(t.name,e),t,e,i)}}R.BLOB_TEXTURE_URL="https://assets.babylonjs.com/meshes/MRTK/mrtk-fluent-button-blob.png";n([_()],R.prototype,"edgeWidth",void 0);n([_i()],R.prototype,"edgeColor",void 0);n([_()],R.prototype,"proximityMaxIntensity",void 0);n([_()],R.prototype,"proximityFarDistance",void 0);n([_()],R.prototype,"proximityNearRadius",void 0);n([_()],R.prototype,"proximityAnisotropy",void 0);n([_()],R.prototype,"selectionFuzz",void 0);n([_()],R.prototype,"selected",void 0);n([_()],R.prototype,"selectionFade",void 0);n([_()],R.prototype,"selectionFadeSize",void 0);n([_()],R.prototype,"selectedDistance",void 0);n([_()],R.prototype,"selectedFadeLength",void 0);n([_()],R.prototype,"blobIntensity",void 0);n([_()],R.prototype,"blobFarSize",void 0);n([_()],R.prototype,"blobNearDistance",void 0);n([_()],R.prototype,"blobFarDistance",void 0);n([_()],R.prototype,"blobFadeLength",void 0);n([_()],R.prototype,"leftBlobEnable",void 0);n([_()],R.prototype,"leftBlobNearSize",void 0);n([_()],R.prototype,"leftBlobPulse",void 0);n([_()],R.prototype,"leftBlobFade",void 0);n([_()],R.prototype,"leftBlobInnerFade",void 0);n([_()],R.prototype,"rightBlobEnable",void 0);n([_()],R.prototype,"rightBlobNearSize",void 0);n([_()],R.prototype,"rightBlobPulse",void 0);n([_()],R.prototype,"rightBlobFade",void 0);n([_()],R.prototype,"rightBlobInnerFade",void 0);n([ae()],R.prototype,"activeFaceDir",void 0);n([ae()],R.prototype,"activeFaceUp",void 0);n([_()],R.prototype,"enableFade",void 0);n([_()],R.prototype,"fadeWidth",void 0);n([_()],R.prototype,"smoothActiveFace",void 0);n([_()],R.prototype,"showFrame",void 0);n([_()],R.prototype,"useBlobTexture",void 0);n([ae()],R.prototype,"globalLeftIndexTipPosition",void 0);n([ae()],R.prototype,"globalRightIndexTipPosition",void 0);F("BABYLON.GUI.FluentButtonMaterial",R);const Ki="handleVertexShader",qi=`precision highp float;
attribute vec3 position;
uniform vec3 positionOffset;
uniform mat4 worldViewProjection;
uniform float scale;
void main(void) {
vec4 vPos=vec4((vec3(position)+positionOffset)*scale,1.0);
gl_Position=worldViewProjection*vPos;
}`;st.ShadersStore[Ki]=qi;const Zi="handlePixelShader",ji=`uniform vec3 color;
void main(void) {
gl_FragColor=vec4(color,1.0);
}`;st.ShadersStore[Zi]=ji;var ii;(function(x){x[x.IDLE=0]="IDLE",x[x.HOVER=1]="HOVER",x[x.DRAG=2]="DRAG"})(ii||(ii={}));const $i="mrdlSliderBarPixelShader",Ji=`uniform vec3 cameraPosition;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vColor;
varying vec4 vExtra1;
varying vec4 vExtra2;
varying vec4 vExtra3;
uniform float _Radius_;
uniform float _Bevel_Front_;
uniform float _Bevel_Front_Stretch_;
uniform float _Bevel_Back_;
uniform float _Bevel_Back_Stretch_;
uniform float _Radius_Top_Left_;
uniform float _Radius_Top_Right_;
uniform float _Radius_Bottom_Left_;
uniform float _Radius_Bottom_Right_;
uniform bool _Bulge_Enabled_;
uniform float _Bulge_Height_;
uniform float _Bulge_Radius_;
uniform float _Sun_Intensity_;
uniform float _Sun_Theta_;
uniform float _Sun_Phi_;
uniform float _Indirect_Diffuse_;
uniform vec4 _Albedo_;
uniform float _Specular_;
uniform float _Shininess_;
uniform float _Sharpness_;
uniform float _Subsurface_;
uniform vec4 _Left_Color_;
uniform vec4 _Right_Color_;
uniform float _Reflection_;
uniform float _Front_Reflect_;
uniform float _Edge_Reflect_;
uniform float _Power_;
uniform vec4 _Sky_Color_;
uniform vec4 _Horizon_Color_;
uniform vec4 _Ground_Color_;
uniform float _Horizon_Power_;
uniform sampler2D _Reflection_Map_;
uniform sampler2D _Indirect_Environment_;
uniform float _Width_;
uniform float _Fuzz_;
uniform float _Min_Fuzz_;
uniform float _Clip_Fade_;
uniform float _Hue_Shift_;
uniform float _Saturation_Shift_;
uniform float _Value_Shift_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform sampler2D _Blob_Texture_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform vec3 _Left_Index_Pos_;
uniform vec3 _Right_Index_Pos_;
uniform vec3 _Left_Index_Middle_Pos_;
uniform vec3 _Right_Index_Middle_Pos_;
uniform sampler2D _Decal_;
uniform vec2 _Decal_Scale_XY_;
uniform bool _Decal_Front_Only_;
uniform float _Rim_Intensity_;
uniform sampler2D _Rim_Texture_;
uniform float _Rim_Hue_Shift_;
uniform float _Rim_Saturation_Shift_;
uniform float _Rim_Value_Shift_;
uniform float _Iridescence_Intensity_;
uniform sampler2D _Iridescence_Texture_;
uniform bool Use_Global_Left_Index;
uniform bool Use_Global_Right_Index;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
uniform vec4 Global_Left_Thumb_Tip_Position;
uniform vec4 Global_Right_Thumb_Tip_Position;
uniform vec4 Global_Left_Index_Middle_Position;
uniform vec4 Global_Right_Index_Middle_Position;
uniform float Global_Left_Index_Tip_Proximity;
uniform float Global_Right_Index_Tip_Proximity;
void Blob_Fragment_B30(
sampler2D Blob_Texture,
vec4 Blob_Info1,
vec4 Blob_Info2,
out vec4 Blob_Color)
{
float k1=dot(Blob_Info1.xy,Blob_Info1.xy);
float k2=dot(Blob_Info2.xy,Blob_Info2.xy);
vec3 closer=k1<k2 ? vec3(k1,Blob_Info1.z,Blob_Info1.w) : vec3(k2,Blob_Info2.z,Blob_Info2.w);
Blob_Color=closer.z*texture(Blob_Texture,vec2(vec2(sqrt(closer.x),closer.y).x,1.0-vec2(sqrt(closer.x),closer.y).y))*clamp(1.0-closer.x,0.0,1.0);
}
void FastLinearTosRGB_B42(
vec4 Linear,
out vec4 sRGB)
{
sRGB.rgb=sqrt(clamp(Linear.rgb,0.0,1.0));
sRGB.a=Linear.a;
}
void Scale_RGB_B59(
vec4 Color,
float Scalar,
out vec4 Result)
{
Result=vec4(Scalar,Scalar,Scalar,1)*Color;
}
void Fragment_Main_B121(
float Sun_Intensity,
float Sun_Theta,
float Sun_Phi,
vec3 Normal,
vec4 Albedo,
float Fresnel_Reflect,
float Shininess,
vec3 Incident,
vec4 Horizon_Color,
vec4 Sky_Color,
vec4 Ground_Color,
float Indirect_Diffuse,
float Specular,
float Horizon_Power,
float Reflection,
vec4 Reflection_Sample,
vec4 Indirect_Sample,
float Sharpness,
float SSS,
float Subsurface,
vec4 Translucence,
vec4 Rim_Light,
vec4 Iridescence,
out vec4 Result)
{
float theta=Sun_Theta*2.0*3.14159;
float phi=Sun_Phi*3.14159;
vec3 lightDir= vec3(cos(phi)*cos(theta),sin(phi),cos(phi)*sin(theta));
float NdotL=max(dot(lightDir,Normal),0.0);
vec3 R=reflect(Incident,Normal);
float RdotL=max(0.0,dot(R,lightDir));
float specular=pow(RdotL,Shininess);
specular=mix(specular,smoothstep(0.495*Sharpness,1.0-0.495*Sharpness,specular),Sharpness);
vec4 gi=mix(Ground_Color,Sky_Color,Normal.y*0.5+0.5);
Result=((Sun_Intensity*NdotL+Indirect_Sample*Indirect_Diffuse+Translucence)*(1.0+SSS*Subsurface))*Albedo*(1.0-Fresnel_Reflect)+(Sun_Intensity*specular*Specular+Fresnel_Reflect*Reflection*Reflection_Sample)+Fresnel_Reflect*Rim_Light+Iridescence;
}
void Bulge_B79(
bool Enabled,
vec3 Normal,
vec3 Tangent,
float Bulge_Height,
vec4 UV,
float Bulge_Radius,
vec3 ButtonN,
out vec3 New_Normal)
{
vec2 xy=clamp(UV.xy*2.0,vec2(-1,-1),vec2(1,1));
vec3 B=(cross(Normal,Tangent));
float k=-clamp(1.0-length(xy)/Bulge_Radius,0.0,1.0)*Bulge_Height;
k=sin(k*3.14159*0.5);
k*=smoothstep(0.9998,0.9999,abs(dot(ButtonN,Normal)));
New_Normal=Normal*sqrt(1.0-k*k)+(xy.x*Tangent+xy.y*B)*k;
New_Normal=Enabled ? New_Normal : Normal;
}
void SSS_B77(
vec3 ButtonN,
vec3 Normal,
vec3 Incident,
out float Result)
{
float NdotI=abs(dot(Normal,Incident));
float BdotI=abs(dot(ButtonN,Incident));
Result=(abs(NdotI-BdotI)); 
}
void FingerOcclusion_B67(
float Width,
float DistToCenter,
float Fuzz,
float Min_Fuzz,
vec3 Position,
vec3 Forward,
vec3 Nearest,
float Fade_Out,
out float NotInShadow)
{
float d=dot((Nearest-Position),Forward);
float sh=smoothstep(Width*0.5,Width*0.5+Fuzz*max(d,0.0)+Min_Fuzz,DistToCenter);
NotInShadow=1.0-(1.0-sh)*smoothstep(-Fade_Out,0.0,d);
}
void FingerOcclusion_B68(
float Width,
float DistToCenter,
float Fuzz,
float Min_Fuzz,
vec3 Position,
vec3 Forward,
vec3 Nearest,
float Fade_Out,
out float NotInShadow)
{
float d=dot((Nearest-Position),Forward);
float sh=smoothstep(Width*0.5,Width*0.5+Fuzz*max(d,0.0)+Min_Fuzz,DistToCenter);
NotInShadow=1.0-(1.0-sh)*smoothstep(-Fade_Out,0.0,d);
}
void Scale_Color_B91(
vec4 Color,
float Scalar,
out vec4 Result)
{
Result=Scalar*Color;
}
void From_HSV_B73(
float Hue,
float Saturation,
float Value,
float Alpha,
out vec4 Color)
{
vec4 K=vec4(1.0,2.0/3.0,1.0/3.0,3.0);
vec3 p=abs(fract(vec3(Hue,Hue,Hue)+K.xyz)*6.0-K.www);
Color.rgb=Value*mix(K.xxx,clamp(p-K.xxx,0.0,1.0),Saturation);
Color.a=Alpha;
}
void Fast_Fresnel_B122(
float Front_Reflect,
float Edge_Reflect,
float Power,
vec3 Normal,
vec3 Incident,
out float Transmit,
out float Reflect)
{
float d=max(-dot(Incident,Normal),0.0);
Reflect=Front_Reflect+(Edge_Reflect-Front_Reflect)*pow(.01-d,Power);
Transmit=1.0-Reflect;
}
void Mapped_Environment_B51(
sampler2D Reflected_Environment,
sampler2D Indirect_Environment,
vec3 Dir,
out vec4 Reflected_Color,
out vec4 Indirect_Diffuse)
{
Reflected_Color=texture(Reflected_Environment,vec2(atan(Dir.z,Dir.x)/3.14159*0.5,asin(Dir.y)/3.14159+0.5));
Indirect_Diffuse=texture(Indirect_Environment,vec2(atan(Dir.z,Dir.x)/3.14159*0.5,asin(Dir.y)/3.14159+0.5));
}
vec4 SampleEnv_Bid50(vec3 D,vec4 S,vec4 H,vec4 G,float exponent)
{
float k=pow(abs(D.y),exponent);
vec4 C;
if (D.y>0.0) {
C=mix(H,S,k);
} else {
C=mix(H,G,k); 
}
return C;
}
void Sky_Environment_B50(
vec3 Normal,
vec3 Reflected,
vec4 Sky_Color,
vec4 Horizon_Color,
vec4 Ground_Color,
float Horizon_Power,
out vec4 Reflected_Color,
out vec4 Indirect_Color)
{
Reflected_Color=SampleEnv_Bid50(Reflected,Sky_Color,Horizon_Color,Ground_Color,Horizon_Power);
Indirect_Color=mix(Ground_Color,Sky_Color,Normal.y*0.5+0.5);
}
void Min_Segment_Distance_B65(
vec3 P0,
vec3 P1,
vec3 Q0,
vec3 Q1,
out vec3 NearP,
out vec3 NearQ,
out float Distance)
{
vec3 u=P1-P0;
vec3 v=Q1-Q0;
vec3 w=P0-Q0;
float a=dot(u,u);
float b=dot(u,v);
float c=dot(v,v);
float d=dot(u,w);
float e=dot(v,w);
float D=a*c-b*b;
float sD=D;
float tD=D;
float sc,sN,tc,tN;
if (D<0.00001) {
sN=0.0;
sD=1.0;
tN=e;
tD=c;
} else {
sN=(b*e-c*d);
tN=(a*e-b*d);
if (sN<0.0) {
sN=0.0;
tN=e;
tD=c;
} else if (sN>sD) {
sN=sD;
tN=e+b;
tD=c;
}
}
if (tN<0.0) {
tN=0.0;
if (-d<0.0) {
sN=0.0;
} else if (-d>a) {
sN=sD;
} else {
sN=-d;
sD=a;
}
} else if (tN>tD) {
tN=tD;
if ((-d+b)<0.0) {
sN=0.0;
} else if ((-d+b)>a) {
sN=sD;
} else {
sN=(-d+b);
sD=a;
}
}
sc=abs(sN)<0.000001 ? 0.0 : sN/sD;
tc=abs(tN)<0.000001 ? 0.0 : tN/tD;
NearP=P0+sc*u;
NearQ=Q0+tc*v;
Distance=distance(NearP,NearQ);
}
void To_XYZ_B74(
vec3 Vec3,
out float X,
out float Y,
out float Z)
{
X=Vec3.x;
Y=Vec3.y;
Z=Vec3.z;
}
void Finger_Positions_B64(
vec3 Left_Index_Pos,
vec3 Right_Index_Pos,
vec3 Left_Index_Middle_Pos,
vec3 Right_Index_Middle_Pos,
out vec3 Left_Index,
out vec3 Right_Index,
out vec3 Left_Index_Middle,
out vec3 Right_Index_Middle)
{
Left_Index= (Use_Global_Left_Index ? Global_Left_Index_Tip_Position.xyz : Left_Index_Pos);
Right_Index= (Use_Global_Right_Index ? Global_Right_Index_Tip_Position.xyz : Right_Index_Pos);
Left_Index_Middle= (Use_Global_Left_Index ? Global_Left_Index_Middle_Position.xyz : Left_Index_Middle_Pos);
Right_Index_Middle= (Use_Global_Right_Index ? Global_Right_Index_Middle_Position.xyz : Right_Index_Middle_Pos);
}
void VaryHSV_B108(
vec3 HSV_In,
float Hue_Shift,
float Saturation_Shift,
float Value_Shift,
out vec3 HSV_Out)
{
HSV_Out=vec3(fract(HSV_In.x+Hue_Shift),clamp(HSV_In.y+Saturation_Shift,0.0,1.0),clamp(HSV_In.z+Value_Shift,0.0,1.0));
}
void Remap_Range_B114(
float In_Min,
float In_Max,
float Out_Min,
float Out_Max,
float In,
out float Out)
{
Out=mix(Out_Min,Out_Max,clamp((In-In_Min)/(In_Max-In_Min),0.0,1.0));
}
void To_HSV_B75(
vec4 Color,
out float Hue,
out float Saturation,
out float Value,
out float Alpha,
out vec3 HSV)
{
vec4 K=vec4(0.0,-1.0/3.0,2.0/3.0,-1.0);
vec4 p=Color.g<Color.b ? vec4(Color.bg,K.wz) : vec4(Color.gb,K.xy);
vec4 q=Color.r<p.x ? vec4(p.xyw,Color.r) : vec4(Color.r,p.yzx);
float d=q.x-min(q.w,q.y);
float e=1.0e-10;
Hue=abs(q.z+(q.w-q.y)/(6.0*d+e));
Saturation=d/(q.x+e);
Value=q.x;
Alpha=Color.a;
HSV=vec3(Hue,Saturation,Value);
}
void Code_B110(
float X,
out float Result)
{
Result=(acos(X)/3.14159-0.5)*2.0;
}
void Rim_Light_B132(
vec3 Front,
vec3 Normal,
vec3 Incident,
float Rim_Intensity,
sampler2D Texture,
out vec4 Result)
{
vec3 R=reflect(Incident,Normal);
float RdotF=dot(R,Front);
float RdotL=sqrt(1.0-RdotF*RdotF);
vec2 UV=vec2(R.y*0.5+0.5,0.5);
vec4 Color=texture(Texture,UV);
Result=Color;
}
void main()
{
vec4 Blob_Color_Q30;
#if BLOB_ENABLE
Blob_Fragment_B30(_Blob_Texture_,vExtra2,vExtra3,Blob_Color_Q30);
#else
Blob_Color_Q30=vec4(0,0,0,0);
#endif
vec3 Incident_Q39=normalize(vPosition-cameraPosition);
vec3 Normalized_Q38=normalize(vNormal);
vec3 Normalized_Q71=normalize(vTangent);
vec4 Color_Q83;
#if DECAL_ENABLE
Color_Q83=texture(_Decal_,vUV);
#else
Color_Q83=vec4(0,0,0,0);
#endif
float X_Q90;
float Y_Q90;
float Z_Q90;
float W_Q90;
X_Q90=vExtra1.x;
Y_Q90=vExtra1.y;
Z_Q90=vExtra1.z;
W_Q90=vExtra1.w;
vec4 Linear_Q43;
Linear_Q43.rgb=clamp(_Sky_Color_.rgb*_Sky_Color_.rgb,0.0,1.0);
Linear_Q43.a=_Sky_Color_.a;
vec4 Linear_Q44;
Linear_Q44.rgb=clamp(_Horizon_Color_.rgb*_Horizon_Color_.rgb,0.0,1.0);
Linear_Q44.a=_Horizon_Color_.a;
vec4 Linear_Q45;
Linear_Q45.rgb=clamp(_Ground_Color_.rgb*_Ground_Color_.rgb,0.0,1.0);
Linear_Q45.a=_Ground_Color_.a;
vec3 Left_Index_Q64;
vec3 Right_Index_Q64;
vec3 Left_Index_Middle_Q64;
vec3 Right_Index_Middle_Q64;
Finger_Positions_B64(_Left_Index_Pos_,_Right_Index_Pos_,_Left_Index_Middle_Pos_,_Right_Index_Middle_Pos_,Left_Index_Q64,Right_Index_Q64,Left_Index_Middle_Q64,Right_Index_Middle_Q64);
vec4 Linear_Q46;
Linear_Q46.rgb=clamp(_Albedo_.rgb*_Albedo_.rgb,0.0,1.0);
Linear_Q46.a=_Albedo_.a;
vec3 Normalized_Q107=normalize(vBinormal);
vec3 Incident_Q70=normalize(vPosition-cameraPosition);
vec3 New_Normal_Q79;
Bulge_B79(_Bulge_Enabled_,Normalized_Q38,Normalized_Q71,_Bulge_Height_,vColor,_Bulge_Radius_,vBinormal,New_Normal_Q79);
float Result_Q77;
SSS_B77(vBinormal,New_Normal_Q79,Incident_Q39,Result_Q77);
vec4 Result_Q91;
Scale_Color_B91(Color_Q83,X_Q90,Result_Q91);
float Transmit_Q122;
float Reflect_Q122;
Fast_Fresnel_B122(_Front_Reflect_,_Edge_Reflect_,_Power_,New_Normal_Q79,Incident_Q39,Transmit_Q122,Reflect_Q122);
float Product_Q125=Y_Q90*Y_Q90;
vec3 NearP_Q65;
vec3 NearQ_Q65;
float Distance_Q65;
Min_Segment_Distance_B65(Left_Index_Q64,Left_Index_Middle_Q64,vPosition,cameraPosition,NearP_Q65,NearQ_Q65,Distance_Q65);
vec3 NearP_Q63;
vec3 NearQ_Q63;
float Distance_Q63;
Min_Segment_Distance_B65(Right_Index_Q64,Right_Index_Middle_Q64,vPosition,cameraPosition,NearP_Q63,NearQ_Q63,Distance_Q63);
vec3 Reflected_Q47=reflect(Incident_Q39,New_Normal_Q79);
vec4 Product_Q103=Linear_Q46*vec4(1,1,1,1);
vec4 Result_Q132;
Rim_Light_B132(Normalized_Q107,Normalized_Q38,Incident_Q70,_Rim_Intensity_,_Rim_Texture_,Result_Q132);
float Dot_Q72=dot(Incident_Q70, Normalized_Q71);
float MaxAB_Q123=max(Reflect_Q122,Product_Q125);
float NotInShadow_Q67;
#if OCCLUSION_ENABLED
FingerOcclusion_B67(_Width_,Distance_Q65,_Fuzz_,_Min_Fuzz_,vPosition,vBinormal,NearP_Q65,_Clip_Fade_,NotInShadow_Q67);
#else
NotInShadow_Q67=1.0;
#endif
float NotInShadow_Q68;
#if OCCLUSION_ENABLED
FingerOcclusion_B68(_Width_,Distance_Q63,_Fuzz_,_Min_Fuzz_,vPosition,vBinormal,NearP_Q63,_Clip_Fade_,NotInShadow_Q68);
#else
NotInShadow_Q68=1.0;
#endif
vec4 Reflected_Color_Q51;
vec4 Indirect_Diffuse_Q51;
#if ENV_ENABLE
Mapped_Environment_B51(_Reflection_Map_,_Indirect_Environment_,Reflected_Q47,Reflected_Color_Q51,Indirect_Diffuse_Q51);
#else
Reflected_Color_Q51=vec4(0,0,0,1);
Indirect_Diffuse_Q51=vec4(0,0,0,1);
#endif
vec4 Reflected_Color_Q50;
vec4 Indirect_Color_Q50;
#if SKY_ENABLED
Sky_Environment_B50(New_Normal_Q79,Reflected_Q47,Linear_Q43,Linear_Q44,Linear_Q45,_Horizon_Power_,Reflected_Color_Q50,Indirect_Color_Q50);
#else
Reflected_Color_Q50=vec4(0,0,0,1);
Indirect_Color_Q50=vec4(0,0,0,1);
#endif
float Hue_Q75;
float Saturation_Q75;
float Value_Q75;
float Alpha_Q75;
vec3 HSV_Q75;
To_HSV_B75(Product_Q103,Hue_Q75,Saturation_Q75,Value_Q75,Alpha_Q75,HSV_Q75);
float Hue_Q127;
float Saturation_Q127;
float Value_Q127;
float Alpha_Q127;
vec3 HSV_Q127;
To_HSV_B75(Result_Q132,Hue_Q127,Saturation_Q127,Value_Q127,Alpha_Q127,HSV_Q127);
float Result_Q110;
Code_B110(Dot_Q72,Result_Q110);
float AbsA_Q76=abs(Result_Q110);
float MinAB_Q58=min(NotInShadow_Q67,NotInShadow_Q68);
vec4 Sum_Q48=Reflected_Color_Q51+Reflected_Color_Q50;
vec4 Sum_Q49=Indirect_Diffuse_Q51+Indirect_Color_Q50;
vec3 HSV_Out_Q126;
VaryHSV_B108(HSV_Q127,_Rim_Hue_Shift_,_Rim_Saturation_Shift_,_Rim_Value_Shift_,HSV_Out_Q126);
float Out_Q114;
Remap_Range_B114(-1.0,1.0,0.0,1.0,Result_Q110,Out_Q114);
float Product_Q106;
Product_Q106=AbsA_Q76*_Hue_Shift_;
float X_Q128;
float Y_Q128;
float Z_Q128;
To_XYZ_B74(HSV_Out_Q126,X_Q128,Y_Q128,Z_Q128);
vec2 Vec2_Q112=vec2(Out_Q114,0.5);
vec3 HSV_Out_Q108;
VaryHSV_B108(HSV_Q75,Product_Q106,_Saturation_Shift_,_Value_Shift_,HSV_Out_Q108);
vec4 Color_Q129;
From_HSV_B73(X_Q128,Y_Q128,Z_Q128,0.0,Color_Q129);
vec4 Color_Q111;
#if IRIDESCENCE_ENABLED
Color_Q111=texture(_Iridescence_Texture_,Vec2_Q112);
#else
Color_Q111=vec4(0,0,0,0);
#endif
float X_Q74;
float Y_Q74;
float Z_Q74;
To_XYZ_B74(HSV_Out_Q108,X_Q74,Y_Q74,Z_Q74);
vec4 Result_Q131=_Rim_Intensity_*Color_Q129;
vec4 Result_Q113=_Iridescence_Intensity_*Color_Q111;
vec4 Color_Q73;
From_HSV_B73(X_Q74,Y_Q74,Z_Q74,0.0,Color_Q73);
vec4 Result_Q84=Result_Q91+(1.0-Result_Q91.a)*Color_Q73;
vec4 Result_Q121;
Fragment_Main_B121(_Sun_Intensity_,_Sun_Theta_,_Sun_Phi_,New_Normal_Q79,Result_Q84,MaxAB_Q123,_Shininess_,Incident_Q39,_Horizon_Color_,_Sky_Color_,_Ground_Color_,_Indirect_Diffuse_,_Specular_,_Horizon_Power_,_Reflection_,Sum_Q48,Sum_Q49,_Sharpness_,Result_Q77,_Subsurface_,vec4(0,0,0,0),Result_Q131,Result_Q113,Result_Q121);
vec4 Result_Q59;
Scale_RGB_B59(Result_Q121,MinAB_Q58,Result_Q59);
vec4 sRGB_Q42;
FastLinearTosRGB_B42(Result_Q59,sRGB_Q42);
vec4 Result_Q31=Blob_Color_Q30+(1.0-Blob_Color_Q30.a)*sRGB_Q42;
vec4 Result_Q40=Result_Q31; Result_Q40.a=1.0;
vec4 Out_Color=Result_Q40;
float Clip_Threshold=0.001;
bool To_sRGB=false;
gl_FragColor=Out_Color;
}`;st.ShadersStore[$i]=Ji;const ts="mrdlSliderBarVertexShader",es=`uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef TANGENT
attribute vec3 tangent;
#else
const vec3 tangent=vec3(0.);
#endif
uniform float _Radius_;
uniform float _Bevel_Front_;
uniform float _Bevel_Front_Stretch_;
uniform float _Bevel_Back_;
uniform float _Bevel_Back_Stretch_;
uniform float _Radius_Top_Left_;
uniform float _Radius_Top_Right_;
uniform float _Radius_Bottom_Left_;
uniform float _Radius_Bottom_Right_;
uniform bool _Bulge_Enabled_;
uniform float _Bulge_Height_;
uniform float _Bulge_Radius_;
uniform float _Sun_Intensity_;
uniform float _Sun_Theta_;
uniform float _Sun_Phi_;
uniform float _Indirect_Diffuse_;
uniform vec4 _Albedo_;
uniform float _Specular_;
uniform float _Shininess_;
uniform float _Sharpness_;
uniform float _Subsurface_;
uniform vec4 _Left_Color_;
uniform vec4 _Right_Color_;
uniform float _Reflection_;
uniform float _Front_Reflect_;
uniform float _Edge_Reflect_;
uniform float _Power_;
uniform vec4 _Sky_Color_;
uniform vec4 _Horizon_Color_;
uniform vec4 _Ground_Color_;
uniform float _Horizon_Power_;
uniform sampler2D _Reflection_Map_;
uniform sampler2D _Indirect_Environment_;
uniform float _Width_;
uniform float _Fuzz_;
uniform float _Min_Fuzz_;
uniform float _Clip_Fade_;
uniform float _Hue_Shift_;
uniform float _Saturation_Shift_;
uniform float _Value_Shift_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform sampler2D _Blob_Texture_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform vec3 _Left_Index_Pos_;
uniform vec3 _Right_Index_Pos_;
uniform vec3 _Left_Index_Middle_Pos_;
uniform vec3 _Right_Index_Middle_Pos_;
uniform sampler2D _Decal_;
uniform vec2 _Decal_Scale_XY_;
uniform bool _Decal_Front_Only_;
uniform float _Rim_Intensity_;
uniform sampler2D _Rim_Texture_;
uniform float _Rim_Hue_Shift_;
uniform float _Rim_Saturation_Shift_;
uniform float _Rim_Value_Shift_;
uniform float _Iridescence_Intensity_;
uniform sampler2D _Iridescence_Texture_;
uniform bool Use_Global_Left_Index;
uniform bool Use_Global_Right_Index;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
uniform vec4 Global_Left_Thumb_Tip_Position;
uniform vec4 Global_Right_Thumb_Tip_Position;
uniform float Global_Left_Index_Tip_Proximity;
uniform float Global_Right_Index_Tip_Proximity;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vColor;
varying vec4 vExtra1;
varying vec4 vExtra2;
varying vec4 vExtra3;
void Object_To_World_Pos_B12(
vec3 Pos_Object,
out vec3 Pos_World)
{
Pos_World=(world*vec4(Pos_Object,1.0)).xyz;
}
void Object_To_World_Normal_B32(
vec3 Nrm_Object,
out vec3 Nrm_World)
{
Nrm_World=(vec4(Nrm_Object,0.0)).xyz;
}
void Blob_Vertex_B23(
vec3 Position,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
vec3 Blob_Position,
float Intensity,
float Blob_Near_Size,
float Blob_Far_Size,
float Blob_Near_Distance,
float Blob_Far_Distance,
float Blob_Fade_Length,
float Blob_Pulse,
float Blob_Fade,
out vec4 Blob_Info)
{
vec3 blob= (Use_Global_Left_Index ? Global_Left_Index_Tip_Position.xyz : Blob_Position);
vec3 delta=blob-Position;
float dist=dot(Normal,delta);
float lerpValue=clamp((abs(dist)-Blob_Near_Distance)/(Blob_Far_Distance-Blob_Near_Distance),0.0,1.0);
float fadeValue=1.0-clamp((abs(dist)-Blob_Far_Distance)/Blob_Fade_Length,0.0,1.0);
float size=Blob_Near_Size+(Blob_Far_Size-Blob_Near_Size)*lerpValue;
vec2 blobXY=vec2(dot(delta,Tangent),dot(delta,Bitangent))/(0.0001+size);
float Fade=fadeValue*Intensity*Blob_Fade;
float Distance=(lerpValue*0.5+0.5)*(1.0-Blob_Pulse);
Blob_Info=vec4(blobXY.x,blobXY.y,Distance,Fade);
}
void Blob_Vertex_B24(
vec3 Position,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
vec3 Blob_Position,
float Intensity,
float Blob_Near_Size,
float Blob_Far_Size,
float Blob_Near_Distance,
float Blob_Far_Distance,
float Blob_Fade_Length,
float Blob_Pulse,
float Blob_Fade,
out vec4 Blob_Info)
{
vec3 blob= (Use_Global_Right_Index ? Global_Right_Index_Tip_Position.xyz : Blob_Position);
vec3 delta=blob-Position;
float dist=dot(Normal,delta);
float lerpValue=clamp((abs(dist)-Blob_Near_Distance)/(Blob_Far_Distance-Blob_Near_Distance),0.0,1.0);
float fadeValue=1.0-clamp((abs(dist)-Blob_Far_Distance)/Blob_Fade_Length,0.0,1.0);
float size=Blob_Near_Size+(Blob_Far_Size-Blob_Near_Size)*lerpValue;
vec2 blobXY=vec2(dot(delta,Tangent),dot(delta,Bitangent))/(0.0001+size);
float Fade=fadeValue*Intensity*Blob_Fade;
float Distance=(lerpValue*0.5+0.5)*(1.0-Blob_Pulse);
Blob_Info=vec4(blobXY.x,blobXY.y,Distance,Fade);
}
void Move_Verts_B130(
float Anisotropy,
vec3 P,
float Radius,
float Bevel,
vec3 Normal_Object,
float ScaleZ,
float Stretch,
out vec3 New_P,
out vec2 New_UV,
out float Radial_Gradient,
out vec3 Radial_Dir,
out vec3 New_Normal)
{
vec2 UV=P.xy*2.0+0.5;
vec2 center=clamp(UV,0.0,1.0);
vec2 delta=UV-center;
float deltad=(length(delta)*2.0);
float f=(Bevel+(Radius-Bevel)*Stretch)/Radius;
float innerd=clamp(deltad*2.0,0.0,1.0);
float outerd=clamp(deltad*2.0-1.0,0.0,1.0);
float bevelAngle=outerd*3.14159*0.5;
float sinb=sin(bevelAngle);
float cosb=cos(bevelAngle);
float beveld=(1.0-f)*innerd+f*sinb;
float br=outerd;
vec2 r2=2.0*vec2(Radius/Anisotropy,Radius);
float dir=P.z<0.0001 ? 1.0 : -1.0;
New_UV=center+r2*((0.5-center)+normalize(delta+vec2(0.0,0.000001))*beveld*0.5);
New_P=vec3(New_UV-0.5,P.z+dir*(1.0-cosb)*Bevel*ScaleZ);
Radial_Gradient=clamp((deltad-0.5)*2.0,0.0,1.0);
Radial_Dir=vec3(delta*r2,0.0);
vec3 beveledNormal=cosb*Normal_Object+sinb*vec3(delta.x,delta.y,0.0);
New_Normal=Normal_Object.z==0.0 ? Normal_Object : beveledNormal;
}
void Object_To_World_Dir_B60(
vec3 Dir_Object,
out vec3 Normal_World,
out vec3 Normal_World_N,
out float Normal_Length)
{
Normal_World=(world*vec4(Dir_Object,0.0)).xyz;
Normal_Length=length(Normal_World);
Normal_World_N=Normal_World/Normal_Length;
}
void To_XYZ_B78(
vec3 Vec3,
out float X,
out float Y,
out float Z)
{
X=Vec3.x;
Y=Vec3.y;
Z=Vec3.z;
}
void Conditional_Float_B93(
bool Which,
float If_True,
float If_False,
out float Result)
{
Result=Which ? If_True : If_False;
}
void Object_To_World_Dir_B28(
vec3 Dir_Object,
out vec3 Binormal_World,
out vec3 Binormal_World_N,
out float Binormal_Length)
{
Binormal_World=(world*vec4(Dir_Object,0.0)).xyz;
Binormal_Length=length(Binormal_World);
Binormal_World_N=Binormal_World/Binormal_Length;
}
void Pick_Radius_B69(
float Radius,
float Radius_Top_Left,
float Radius_Top_Right,
float Radius_Bottom_Left,
float Radius_Bottom_Right,
vec3 Position,
out float Result)
{
bool whichY=Position.y>0.0;
Result=Position.x<0.0 ? (whichY ? Radius_Top_Left : Radius_Bottom_Left) : (whichY ? Radius_Top_Right : Radius_Bottom_Right);
Result*=Radius;
}
void Conditional_Float_B36(
bool Which,
float If_True,
float If_False,
out float Result)
{
Result=Which ? If_True : If_False;
}
void Greater_Than_B37(
float Left,
float Right,
out bool Not_Greater_Than,
out bool Greater_Than)
{
Greater_Than=Left>Right;
Not_Greater_Than=!Greater_Than;
}
void Remap_Range_B105(
float In_Min,
float In_Max,
float Out_Min,
float Out_Max,
float In,
out float Out)
{
Out=mix(Out_Min,Out_Max,clamp((In-In_Min)/(In_Max-In_Min),0.0,1.0));
}
void main()
{
vec2 XY_Q85;
XY_Q85=(uv-vec2(0.5,0.5))*_Decal_Scale_XY_+vec2(0.5,0.5);
vec3 Tangent_World_Q27;
vec3 Tangent_World_N_Q27;
float Tangent_Length_Q27;
Tangent_World_Q27=(world*vec4(vec3(1,0,0),0.0)).xyz;
Tangent_Length_Q27=length(Tangent_World_Q27);
Tangent_World_N_Q27=Tangent_World_Q27/Tangent_Length_Q27;
vec3 Normal_World_Q60;
vec3 Normal_World_N_Q60;
float Normal_Length_Q60;
Object_To_World_Dir_B60(vec3(0,0,1),Normal_World_Q60,Normal_World_N_Q60,Normal_Length_Q60);
float X_Q78;
float Y_Q78;
float Z_Q78;
To_XYZ_B78(position,X_Q78,Y_Q78,Z_Q78);
vec3 Nrm_World_Q26;
Nrm_World_Q26=normalize((world*vec4(normal,0.0)).xyz);
vec3 Binormal_World_Q28;
vec3 Binormal_World_N_Q28;
float Binormal_Length_Q28;
Object_To_World_Dir_B28(vec3(0,1,0),Binormal_World_Q28,Binormal_World_N_Q28,Binormal_Length_Q28);
float Anisotropy_Q29=Tangent_Length_Q27/Binormal_Length_Q28;
float Result_Q69;
Pick_Radius_B69(_Radius_,_Radius_Top_Left_,_Radius_Top_Right_,_Radius_Bottom_Left_,_Radius_Bottom_Right_,position,Result_Q69);
float Anisotropy_Q53=Binormal_Length_Q28/Normal_Length_Q60;
bool Not_Greater_Than_Q37;
bool Greater_Than_Q37;
Greater_Than_B37(Z_Q78,0.0,Not_Greater_Than_Q37,Greater_Than_Q37);
vec4 Linear_Q101;
Linear_Q101.rgb=clamp(_Left_Color_.rgb*_Left_Color_.rgb,0.0,1.0);
Linear_Q101.a=_Left_Color_.a;
vec4 Linear_Q102;
Linear_Q102.rgb=clamp(_Right_Color_.rgb*_Right_Color_.rgb,0.0,1.0);
Linear_Q102.a=_Right_Color_.a;
vec3 Difference_Q61=vec3(0,0,0)-Normal_World_N_Q60;
vec4 Out_Color_Q34=vec4(X_Q78,Y_Q78,Z_Q78,1);
float Result_Q36;
Conditional_Float_B36(Greater_Than_Q37,_Bevel_Back_,_Bevel_Front_,Result_Q36);
float Result_Q94;
Conditional_Float_B36(Greater_Than_Q37,_Bevel_Back_Stretch_,_Bevel_Front_Stretch_,Result_Q94);
vec3 New_P_Q130;
vec2 New_UV_Q130;
float Radial_Gradient_Q130;
vec3 Radial_Dir_Q130;
vec3 New_Normal_Q130;
Move_Verts_B130(Anisotropy_Q29,position,Result_Q69,Result_Q36,normal,Anisotropy_Q53,Result_Q94,New_P_Q130,New_UV_Q130,Radial_Gradient_Q130,Radial_Dir_Q130,New_Normal_Q130);
float X_Q98;
float Y_Q98;
X_Q98=New_UV_Q130.x;
Y_Q98=New_UV_Q130.y;
vec3 Pos_World_Q12;
Object_To_World_Pos_B12(New_P_Q130,Pos_World_Q12);
vec3 Nrm_World_Q32;
Object_To_World_Normal_B32(New_Normal_Q130,Nrm_World_Q32);
vec4 Blob_Info_Q23;
#if BLOB_ENABLE
Blob_Vertex_B23(Pos_World_Q12,Nrm_World_Q26,Tangent_World_N_Q27,Binormal_World_N_Q28,_Blob_Position_,_Blob_Intensity_,_Blob_Near_Size_,_Blob_Far_Size_,_Blob_Near_Distance_,_Blob_Far_Distance_,_Blob_Fade_Length_,_Blob_Pulse_,_Blob_Fade_,Blob_Info_Q23);
#else
Blob_Info_Q23=vec4(0,0,0,0);
#endif
vec4 Blob_Info_Q24;
#if BLOB_ENABLE_2
Blob_Vertex_B24(Pos_World_Q12,Nrm_World_Q26,Tangent_World_N_Q27,Binormal_World_N_Q28,_Blob_Position_2_,_Blob_Intensity_,_Blob_Near_Size_2_,_Blob_Far_Size_,_Blob_Near_Distance_,_Blob_Far_Distance_,_Blob_Fade_Length_,_Blob_Pulse_2_,_Blob_Fade_2_,Blob_Info_Q24);
#else
Blob_Info_Q24=vec4(0,0,0,0);
#endif
float Out_Q105;
Remap_Range_B105(0.0,1.0,0.0,1.0,X_Q98,Out_Q105);
float X_Q86;
float Y_Q86;
float Z_Q86;
To_XYZ_B78(Nrm_World_Q32,X_Q86,Y_Q86,Z_Q86);
vec4 Color_At_T_Q97=mix(Linear_Q101,Linear_Q102,Out_Q105);
float Minus_F_Q87=-Z_Q86;
float R_Q99;
float G_Q99;
float B_Q99;
float A_Q99;
R_Q99=Color_At_T_Q97.r; G_Q99=Color_At_T_Q97.g; B_Q99=Color_At_T_Q97.b; A_Q99=Color_At_T_Q97.a;
float ClampF_Q88=clamp(0.0,Minus_F_Q87,1.0);
float Result_Q93;
Conditional_Float_B93(_Decal_Front_Only_,ClampF_Q88,1.0,Result_Q93);
vec4 Vec4_Q89=vec4(Result_Q93,Radial_Gradient_Q130,G_Q99,B_Q99);
vec3 Position=Pos_World_Q12;
vec3 Normal=Nrm_World_Q32;
vec2 UV=XY_Q85;
vec3 Tangent=Tangent_World_N_Q27;
vec3 Binormal=Difference_Q61;
vec4 Color=Out_Color_Q34;
vec4 Extra1=Vec4_Q89;
vec4 Extra2=Blob_Info_Q23;
vec4 Extra3=Blob_Info_Q24;
gl_Position=viewProjection*vec4(Position,1);
vPosition=Position;
vNormal=Normal;
vUV=UV;
vTangent=Tangent;
vBinormal=Binormal;
vColor=Color;
vExtra1=Extra1;
vExtra2=Extra2;
vExtra3=Extra3;
}`;st.ShadersStore[ts]=es;class is extends Wt{constructor(){super(),this.SKY_ENABLED=!0,this.BLOB_ENABLE_2=!0,this.IRIDESCENCE_ENABLED=!0,this._needNormals=!0,this._needUVs=!0,this.rebuild()}}class b extends zt{constructor(t,e){super(t,e),this.radius=.6,this.bevelFront=.6,this.bevelFrontStretch=.077,this.bevelBack=0,this.bevelBackStretch=0,this.radiusTopLeft=1,this.radiusTopRight=1,this.radiusBottomLeft=1,this.radiusBottomRight=1,this.bulgeEnabled=!1,this.bulgeHeight=-.323,this.bulgeRadius=.73,this.sunIntensity=1.102,this.sunTheta=.76,this.sunPhi=.526,this.indirectDiffuse=.658,this.albedo=new M(.0117647,.505882,.996078,1),this.specular=0,this.shininess=10,this.sharpness=0,this.subsurface=0,this.leftGradientColor=new M(.0117647,.505882,.996078,1),this.rightGradientColor=new M(.0117647,.505882,.996078,1),this.reflection=.749,this.frontReflect=0,this.edgeReflect=.09,this.power=8.13,this.skyColor=new M(.0117647,.964706,.996078,1),this.horizonColor=new M(.0117647,.333333,.996078,1),this.groundColor=new M(0,.254902,.996078,1),this.horizonPower=1,this.width=.02,this.fuzz=.5,this.minFuzz=.001,this.clipFade=.01,this.hueShift=0,this.saturationShift=0,this.valueShift=0,this.blobPosition=new D(0,0,.1),this.blobIntensity=.5,this.blobNearSize=.01,this.blobFarSize=.03,this.blobNearDistance=0,this.blobFarDistance=.08,this.blobFadeLength=.576,this.blobPulse=0,this.blobFade=1,this.blobPosition2=new D(.2,0,.1),this.blobNearSize2=.01,this.blobPulse2=0,this.blobFade2=1,this.blobTexture=new O("",this.getScene()),this.leftIndexPosition=new D(0,0,1),this.rightIndexPosition=new D(-1,-1,-1),this.leftIndexMiddlePosition=new D(0,0,0),this.rightIndexMiddlePosition=new D(0,0,0),this.decalScaleXY=new W(1.5,1.5),this.decalFrontOnly=!0,this.rimIntensity=.287,this.rimHueShift=0,this.rimSaturationShift=0,this.rimValueShift=-1,this.iridescenceIntensity=0,this.useGlobalLeftIndex=1,this.useGlobalRightIndex=1,this.globalLeftIndexTipProximity=0,this.globalRightIndexTipProximity=0,this.globalLeftIndexTipPosition=new rt(.5,0,-.55,1),this.globaRightIndexTipPosition=new rt(0,0,0,1),this.globalLeftThumbTipPosition=new rt(.5,0,-.55,1),this.globalRightThumbTipPosition=new rt(0,0,0,1),this.globalLeftIndexMiddlePosition=new rt(.5,0,-.55,1),this.globalRightIndexMiddlePosition=new rt(0,0,0,1),this.alphaMode=Rt.ALPHA_DISABLE,this.backFaceCulling=!1,this._blueGradientTexture=new O(b.BLUE_GRADIENT_TEXTURE_URL,this.getScene(),!0,!1,O.NEAREST_SAMPLINGMODE),this._decalTexture=new O("",this.getScene()),this._reflectionMapTexture=new O("",this.getScene()),this._indirectEnvTexture=new O("",this.getScene())}needAlphaBlending(){return!1}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(t,e){if(this.isFrozen&&e.effect&&e.effect._wasPreviouslyReady)return!0;e.materialDefines||(e.materialDefines=new is);const i=e.materialDefines,s=this.getScene();if(this._isReadyForSubMesh(e))return!0;const o=s.getEngine();if(L.PrepareDefinesForAttributes(t,i,!1,!1),i.isDirty){i.markAsProcessed(),s.resetCachedMaterial();const r=new qt;i.FOG&&r.addFallback(1,"FOG"),L.HandleFallbacksForShadows(i,r),i.IMAGEPROCESSINGPOSTPROCESS=s.imageProcessingConfiguration.applyByPostProcess;const a=[B.PositionKind];i.NORMAL&&a.push(B.NormalKind),i.UV1&&a.push(B.UVKind),i.UV2&&a.push(B.UV2Kind),i.VERTEXCOLOR&&a.push(B.ColorKind),i.TANGENT&&a.push(B.TangentKind),L.PrepareAttributesForInstances(a,i);const l="mrdlSliderBar",h=i.toString(),f=["world","viewProjection","cameraPosition","_Radius_","_Bevel_Front_","_Bevel_Front_Stretch_","_Bevel_Back_","_Bevel_Back_Stretch_","_Radius_Top_Left_","_Radius_Top_Right_","_Radius_Bottom_Left_","_Radius_Bottom_Right_","_Bulge_Enabled_","_Bulge_Height_","_Bulge_Radius_","_Sun_Intensity_","_Sun_Theta_","_Sun_Phi_","_Indirect_Diffuse_","_Albedo_","_Specular_","_Shininess_","_Sharpness_","_Subsurface_","_Left_Color_","_Right_Color_","_Reflection_","_Front_Reflect_","_Edge_Reflect_","_Power_","_Sky_Color_","_Horizon_Color_","_Ground_Color_","_Horizon_Power_","_Reflection_Map_","_Indirect_Environment_","_Width_","_Fuzz_","_Min_Fuzz_","_Clip_Fade_","_Hue_Shift_","_Saturation_Shift_","_Value_Shift_","_Blob_Position_","_Blob_Intensity_","_Blob_Near_Size_","_Blob_Far_Size_","_Blob_Near_Distance_","_Blob_Far_Distance_","_Blob_Fade_Length_","_Blob_Pulse_","_Blob_Fade_","_Blob_Texture_","_Blob_Position_2_","_Blob_Near_Size_2_","_Blob_Pulse_2_","_Blob_Fade_2_","_Left_Index_Pos_","_Right_Index_Pos_","_Left_Index_Middle_Pos_","_Right_Index_Middle_Pos_","_Decal_","_Decal_Scale_XY_","_Decal_Front_Only_","_Rim_Intensity_","_Rim_Texture_","_Rim_Hue_Shift_","_Rim_Saturation_Shift_","_Rim_Value_Shift_","_Iridescence_Intensity_","_Iridescence_Texture_","Use_Global_Left_Index","Use_Global_Right_Index","Global_Left_Index_Tip_Position","Global_Right_Index_Tip_Position","Global_Left_Thumb_Tip_Position","Global_Right_Thumb_Tip_Position","Global_Left_Index_Middle_Position;","Global_Right_Index_Middle_Position","Global_Left_Index_Tip_Proximity","Global_Right_Index_Tip_Proximity"],d=["_Rim_Texture_","_Iridescence_Texture_"],u=new Array;L.PrepareUniformsAndSamplersList({uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:i,maxSimultaneousLights:4}),e.setEffect(s.getEngine().createEffect(l,{attributes:a,uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:h,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),i,this._materialContext)}return!e.effect||!e.effect.isReady()?!1:(i._renderId=s.getRenderId(),e.effect._wasPreviouslyReady=!0,!0)}bindForSubMesh(t,e,i){if(!i.materialDefines)return;const o=i.effect;o&&(this._activeEffect=o,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("viewProjection",this.getScene().getTransformMatrix()),this._activeEffect.setVector3("cameraPosition",this.getScene().activeCamera.position),this._activeEffect.setFloat("_Radius_",this.radius),this._activeEffect.setFloat("_Bevel_Front_",this.bevelFront),this._activeEffect.setFloat("_Bevel_Front_Stretch_",this.bevelFrontStretch),this._activeEffect.setFloat("_Bevel_Back_",this.bevelBack),this._activeEffect.setFloat("_Bevel_Back_Stretch_",this.bevelBackStretch),this._activeEffect.setFloat("_Radius_Top_Left_",this.radiusTopLeft),this._activeEffect.setFloat("_Radius_Top_Right_",this.radiusTopRight),this._activeEffect.setFloat("_Radius_Bottom_Left_",this.radiusBottomLeft),this._activeEffect.setFloat("_Radius_Bottom_Right_",this.radiusBottomRight),this._activeEffect.setFloat("_Bulge_Enabled_",this.bulgeEnabled?1:0),this._activeEffect.setFloat("_Bulge_Height_",this.bulgeHeight),this._activeEffect.setFloat("_Bulge_Radius_",this.bulgeRadius),this._activeEffect.setFloat("_Sun_Intensity_",this.sunIntensity),this._activeEffect.setFloat("_Sun_Theta_",this.sunTheta),this._activeEffect.setFloat("_Sun_Phi_",this.sunPhi),this._activeEffect.setFloat("_Indirect_Diffuse_",this.indirectDiffuse),this._activeEffect.setDirectColor4("_Albedo_",this.albedo),this._activeEffect.setFloat("_Specular_",this.specular),this._activeEffect.setFloat("_Shininess_",this.shininess),this._activeEffect.setFloat("_Sharpness_",this.sharpness),this._activeEffect.setFloat("_Subsurface_",this.subsurface),this._activeEffect.setDirectColor4("_Left_Color_",this.leftGradientColor),this._activeEffect.setDirectColor4("_Right_Color_",this.rightGradientColor),this._activeEffect.setFloat("_Reflection_",this.reflection),this._activeEffect.setFloat("_Front_Reflect_",this.frontReflect),this._activeEffect.setFloat("_Edge_Reflect_",this.edgeReflect),this._activeEffect.setFloat("_Power_",this.power),this._activeEffect.setDirectColor4("_Sky_Color_",this.skyColor),this._activeEffect.setDirectColor4("_Horizon_Color_",this.horizonColor),this._activeEffect.setDirectColor4("_Ground_Color_",this.groundColor),this._activeEffect.setFloat("_Horizon_Power_",this.horizonPower),this._activeEffect.setTexture("_Reflection_Map_",this._reflectionMapTexture),this._activeEffect.setTexture("_Indirect_Environment_",this._indirectEnvTexture),this._activeEffect.setFloat("_Width_",this.width),this._activeEffect.setFloat("_Fuzz_",this.fuzz),this._activeEffect.setFloat("_Min_Fuzz_",this.minFuzz),this._activeEffect.setFloat("_Clip_Fade_",this.clipFade),this._activeEffect.setFloat("_Hue_Shift_",this.hueShift),this._activeEffect.setFloat("_Saturation_Shift_",this.saturationShift),this._activeEffect.setFloat("_Value_Shift_",this.valueShift),this._activeEffect.setVector3("_Blob_Position_",this.blobPosition),this._activeEffect.setFloat("_Blob_Intensity_",this.blobIntensity),this._activeEffect.setFloat("_Blob_Near_Size_",this.blobNearSize),this._activeEffect.setFloat("_Blob_Far_Size_",this.blobFarSize),this._activeEffect.setFloat("_Blob_Near_Distance_",this.blobNearDistance),this._activeEffect.setFloat("_Blob_Far_Distance_",this.blobFarDistance),this._activeEffect.setFloat("_Blob_Fade_Length_",this.blobFadeLength),this._activeEffect.setFloat("_Blob_Pulse_",this.blobPulse),this._activeEffect.setFloat("_Blob_Fade_",this.blobFade),this._activeEffect.setTexture("_Blob_Texture_",this.blobTexture),this._activeEffect.setVector3("_Blob_Position_2_",this.blobPosition2),this._activeEffect.setFloat("_Blob_Near_Size_2_",this.blobNearSize2),this._activeEffect.setFloat("_Blob_Pulse_2_",this.blobPulse2),this._activeEffect.setFloat("_Blob_Fade_2_",this.blobFade2),this._activeEffect.setVector3("_Left_Index_Pos_",this.leftIndexPosition),this._activeEffect.setVector3("_Right_Index_Pos_",this.rightIndexPosition),this._activeEffect.setVector3("_Left_Index_Middle_Pos_",this.leftIndexMiddlePosition),this._activeEffect.setVector3("_Right_Index_Middle_Pos_",this.rightIndexMiddlePosition),this._activeEffect.setTexture("_Decal_",this._decalTexture),this._activeEffect.setVector2("_Decal_Scale_XY_",this.decalScaleXY),this._activeEffect.setFloat("_Decal_Front_Only_",this.decalFrontOnly?1:0),this._activeEffect.setFloat("_Rim_Intensity_",this.rimIntensity),this._activeEffect.setTexture("_Rim_Texture_",this._blueGradientTexture),this._activeEffect.setFloat("_Rim_Hue_Shift_",this.rimHueShift),this._activeEffect.setFloat("_Rim_Saturation_Shift_",this.rimSaturationShift),this._activeEffect.setFloat("_Rim_Value_Shift_",this.rimValueShift),this._activeEffect.setFloat("_Iridescence_Intensity_",this.iridescenceIntensity),this._activeEffect.setTexture("_Iridescence_Texture_",this._blueGradientTexture),this._activeEffect.setFloat("Use_Global_Left_Index",this.useGlobalLeftIndex),this._activeEffect.setFloat("Use_Global_Right_Index",this.useGlobalRightIndex),this._activeEffect.setVector4("Global_Left_Index_Tip_Position",this.globalLeftIndexTipPosition),this._activeEffect.setVector4("Global_Right_Index_Tip_Position",this.globaRightIndexTipPosition),this._activeEffect.setVector4("Global_Left_Thumb_Tip_Position",this.globalLeftThumbTipPosition),this._activeEffect.setVector4("Global_Right_Thumb_Tip_Position",this.globalRightThumbTipPosition),this._activeEffect.setVector4("Global_Left_Index_Middle_Position",this.globalLeftIndexMiddlePosition),this._activeEffect.setVector4("Global_Right_Index_Middle_Position",this.globalRightIndexMiddlePosition),this._activeEffect.setFloat("Global_Left_Index_Tip_Proximity",this.globalLeftIndexTipProximity),this._activeEffect.setFloat("Global_Right_Index_Tip_Proximity",this.globalRightIndexTipProximity),this._afterBind(e,this._activeEffect))}getAnimatables(){return[]}dispose(t){super.dispose(t),this._reflectionMapTexture.dispose(),this._indirectEnvTexture.dispose(),this._blueGradientTexture.dispose(),this._decalTexture.dispose()}clone(t){return H.Clone(()=>new b(t,this.getScene()),this)}serialize(){const t=super.serialize();return t.customType="BABYLON.MRDLSliderBarMaterial",t}getClassName(){return"MRDLSliderBarMaterial"}static Parse(t,e,i){return H.Parse(()=>new b(t.name,e),t,e,i)}}b.BLUE_GRADIENT_TEXTURE_URL="https://assets.babylonjs.com/meshes/MRTK/MRDL/mrtk-mrdl-blue-gradient.png";n([_()],b.prototype,"radius",void 0);n([_()],b.prototype,"bevelFront",void 0);n([_()],b.prototype,"bevelFrontStretch",void 0);n([_()],b.prototype,"bevelBack",void 0);n([_()],b.prototype,"bevelBackStretch",void 0);n([_()],b.prototype,"radiusTopLeft",void 0);n([_()],b.prototype,"radiusTopRight",void 0);n([_()],b.prototype,"radiusBottomLeft",void 0);n([_()],b.prototype,"radiusBottomRight",void 0);n([_()],b.prototype,"bulgeEnabled",void 0);n([_()],b.prototype,"bulgeHeight",void 0);n([_()],b.prototype,"bulgeRadius",void 0);n([_()],b.prototype,"sunIntensity",void 0);n([_()],b.prototype,"sunTheta",void 0);n([_()],b.prototype,"sunPhi",void 0);n([_()],b.prototype,"indirectDiffuse",void 0);n([_()],b.prototype,"albedo",void 0);n([_()],b.prototype,"specular",void 0);n([_()],b.prototype,"shininess",void 0);n([_()],b.prototype,"sharpness",void 0);n([_()],b.prototype,"subsurface",void 0);n([_()],b.prototype,"leftGradientColor",void 0);n([_()],b.prototype,"rightGradientColor",void 0);n([_()],b.prototype,"reflection",void 0);n([_()],b.prototype,"frontReflect",void 0);n([_()],b.prototype,"edgeReflect",void 0);n([_()],b.prototype,"power",void 0);n([_()],b.prototype,"skyColor",void 0);n([_()],b.prototype,"horizonColor",void 0);n([_()],b.prototype,"groundColor",void 0);n([_()],b.prototype,"horizonPower",void 0);n([_()],b.prototype,"width",void 0);n([_()],b.prototype,"fuzz",void 0);n([_()],b.prototype,"minFuzz",void 0);n([_()],b.prototype,"clipFade",void 0);n([_()],b.prototype,"hueShift",void 0);n([_()],b.prototype,"saturationShift",void 0);n([_()],b.prototype,"valueShift",void 0);n([_()],b.prototype,"blobPosition",void 0);n([_()],b.prototype,"blobIntensity",void 0);n([_()],b.prototype,"blobNearSize",void 0);n([_()],b.prototype,"blobFarSize",void 0);n([_()],b.prototype,"blobNearDistance",void 0);n([_()],b.prototype,"blobFarDistance",void 0);n([_()],b.prototype,"blobFadeLength",void 0);n([_()],b.prototype,"blobPulse",void 0);n([_()],b.prototype,"blobFade",void 0);n([_()],b.prototype,"blobPosition2",void 0);n([_()],b.prototype,"blobNearSize2",void 0);n([_()],b.prototype,"blobPulse2",void 0);n([_()],b.prototype,"blobFade2",void 0);n([_()],b.prototype,"blobTexture",void 0);n([_()],b.prototype,"leftIndexPosition",void 0);n([_()],b.prototype,"rightIndexPosition",void 0);n([_()],b.prototype,"leftIndexMiddlePosition",void 0);n([_()],b.prototype,"rightIndexMiddlePosition",void 0);n([_()],b.prototype,"decalScaleXY",void 0);n([_()],b.prototype,"decalFrontOnly",void 0);n([_()],b.prototype,"rimIntensity",void 0);n([_()],b.prototype,"rimHueShift",void 0);n([_()],b.prototype,"rimSaturationShift",void 0);n([_()],b.prototype,"rimValueShift",void 0);n([_()],b.prototype,"iridescenceIntensity",void 0);F("BABYLON.GUI.MRDLSliderBarMaterial",b);const ss="mrdlSliderThumbPixelShader",os=`uniform vec3 cameraPosition;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vColor;
varying vec4 vExtra1;
varying vec4 vExtra2;
varying vec4 vExtra3;
uniform float _Radius_;
uniform float _Bevel_Front_;
uniform float _Bevel_Front_Stretch_;
uniform float _Bevel_Back_;
uniform float _Bevel_Back_Stretch_;
uniform float _Radius_Top_Left_;
uniform float _Radius_Top_Right_;
uniform float _Radius_Bottom_Left_;
uniform float _Radius_Bottom_Right_;
uniform bool _Bulge_Enabled_;
uniform float _Bulge_Height_;
uniform float _Bulge_Radius_;
uniform float _Sun_Intensity_;
uniform float _Sun_Theta_;
uniform float _Sun_Phi_;
uniform float _Indirect_Diffuse_;
uniform vec4 _Albedo_;
uniform float _Specular_;
uniform float _Shininess_;
uniform float _Sharpness_;
uniform float _Subsurface_;
uniform vec4 _Left_Color_;
uniform vec4 _Right_Color_;
uniform float _Reflection_;
uniform float _Front_Reflect_;
uniform float _Edge_Reflect_;
uniform float _Power_;
uniform vec4 _Sky_Color_;
uniform vec4 _Horizon_Color_;
uniform vec4 _Ground_Color_;
uniform float _Horizon_Power_;
uniform sampler2D _Reflection_Map_;
uniform sampler2D _Indirect_Environment_;
uniform float _Width_;
uniform float _Fuzz_;
uniform float _Min_Fuzz_;
uniform float _Clip_Fade_;
uniform float _Hue_Shift_;
uniform float _Saturation_Shift_;
uniform float _Value_Shift_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform sampler2D _Blob_Texture_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform vec3 _Left_Index_Pos_;
uniform vec3 _Right_Index_Pos_;
uniform vec3 _Left_Index_Middle_Pos_;
uniform vec3 _Right_Index_Middle_Pos_;
uniform sampler2D _Decal_;
uniform vec2 _Decal_Scale_XY_;
uniform bool _Decal_Front_Only_;
uniform float _Rim_Intensity_;
uniform sampler2D _Rim_Texture_;
uniform float _Rim_Hue_Shift_;
uniform float _Rim_Saturation_Shift_;
uniform float _Rim_Value_Shift_;
uniform float _Iridescence_Intensity_;
uniform sampler2D _Iridescence_Texture_;
uniform bool Use_Global_Left_Index;
uniform bool Use_Global_Right_Index;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
uniform vec4 Global_Left_Thumb_Tip_Position;
uniform vec4 Global_Right_Thumb_Tip_Position;
uniform vec4 Global_Left_Index_Middle_Position;
uniform vec4 Global_Right_Index_Middle_Position;
uniform float Global_Left_Index_Tip_Proximity;
uniform float Global_Right_Index_Tip_Proximity;
void Blob_Fragment_B180(
sampler2D Blob_Texture,
vec4 Blob_Info1,
vec4 Blob_Info2,
out vec4 Blob_Color)
{
float k1=dot(Blob_Info1.xy,Blob_Info1.xy);
float k2=dot(Blob_Info2.xy,Blob_Info2.xy);
vec3 closer=k1<k2 ? vec3(k1,Blob_Info1.z,Blob_Info1.w) : vec3(k2,Blob_Info2.z,Blob_Info2.w);
Blob_Color=closer.z*texture(Blob_Texture,vec2(vec2(sqrt(closer.x),closer.y).x,1.0-vec2(sqrt(closer.x),closer.y).y))*clamp(1.0-closer.x,0.0,1.0);
}
void FastLinearTosRGB_B192(
vec4 Linear,
out vec4 sRGB)
{
sRGB.rgb=sqrt(clamp(Linear.rgb,0.0,1.0));
sRGB.a=Linear.a;
}
void Scale_RGB_B209(
vec4 Color,
float Scalar,
out vec4 Result)
{
Result=vec4(Scalar,Scalar,Scalar,1)*Color;
}
void Fragment_Main_B271(
float Sun_Intensity,
float Sun_Theta,
float Sun_Phi,
vec3 Normal,
vec4 Albedo,
float Fresnel_Reflect,
float Shininess,
vec3 Incident,
vec4 Horizon_Color,
vec4 Sky_Color,
vec4 Ground_Color,
float Indirect_Diffuse,
float Specular,
float Horizon_Power,
float Reflection,
vec4 Reflection_Sample,
vec4 Indirect_Sample,
float Sharpness,
float SSS,
float Subsurface,
vec4 Translucence,
vec4 Rim_Light,
vec4 Iridescence,
out vec4 Result)
{
float theta=Sun_Theta*2.0*3.14159;
float phi=Sun_Phi*3.14159;
vec3 lightDir= vec3(cos(phi)*cos(theta),sin(phi),cos(phi)*sin(theta));
float NdotL=max(dot(lightDir,Normal),0.0);
vec3 R=reflect(Incident,Normal);
float RdotL=max(0.0,dot(R,lightDir));
float specular=pow(RdotL,Shininess);
specular=mix(specular,smoothstep(0.495*Sharpness,1.0-0.495*Sharpness,specular),Sharpness);
vec4 gi=mix(Ground_Color,Sky_Color,Normal.y*0.5+0.5);
Result=((Sun_Intensity*NdotL+Indirect_Sample*Indirect_Diffuse+Translucence)*(1.0+SSS*Subsurface))*Albedo*(1.0-Fresnel_Reflect)+(Sun_Intensity*specular*Specular+Fresnel_Reflect*Reflection*Reflection_Sample)+Fresnel_Reflect*Rim_Light+Iridescence;
}
void Bulge_B229(
bool Enabled,
vec3 Normal,
vec3 Tangent,
float Bulge_Height,
vec4 UV,
float Bulge_Radius,
vec3 ButtonN,
out vec3 New_Normal)
{
vec2 xy=clamp(UV.xy*2.0,vec2(-1,-1),vec2(1,1));
vec3 B=(cross(Normal,Tangent));
float k=-clamp(1.0-length(xy)/Bulge_Radius,0.0,1.0)*Bulge_Height;
k=sin(k*3.14159*0.5);
k*=smoothstep(0.9998,0.9999,abs(dot(ButtonN,Normal)));
New_Normal=Normal*sqrt(1.0-k*k)+(xy.x*Tangent+xy.y*B)*k;
New_Normal=Enabled ? New_Normal : Normal;
}
void SSS_B227(
vec3 ButtonN,
vec3 Normal,
vec3 Incident,
out float Result)
{
float NdotI=abs(dot(Normal,Incident));
float BdotI=abs(dot(ButtonN,Incident));
Result=(abs(NdotI-BdotI)); 
}
void FingerOcclusion_B217(
float Width,
float DistToCenter,
float Fuzz,
float Min_Fuzz,
vec3 Position,
vec3 Forward,
vec3 Nearest,
float Fade_Out,
out float NotInShadow)
{
float d=dot((Nearest-Position),Forward);
float sh=smoothstep(Width*0.5,Width*0.5+Fuzz*max(d,0.0)+Min_Fuzz,DistToCenter);
NotInShadow=1.0-(1.0-sh)*smoothstep(-Fade_Out,0.0,d);
}
void FingerOcclusion_B218(
float Width,
float DistToCenter,
float Fuzz,
float Min_Fuzz,
vec3 Position,
vec3 Forward,
vec3 Nearest,
float Fade_Out,
out float NotInShadow)
{
float d=dot((Nearest-Position),Forward);
float sh=smoothstep(Width*0.5,Width*0.5+Fuzz*max(d,0.0)+Min_Fuzz,DistToCenter);
NotInShadow=1.0-(1.0-sh)*smoothstep(-Fade_Out,0.0,d);
}
void Scale_Color_B241(
vec4 Color,
float Scalar,
out vec4 Result)
{
Result=Scalar*Color;
}
void From_HSV_B223(
float Hue,
float Saturation,
float Value,
float Alpha,
out vec4 Color)
{
vec4 K=vec4(1.0,2.0/3.0,1.0/3.0,3.0);
vec3 p=abs(fract(vec3(Hue,Hue,Hue)+K.xyz)*6.0-K.www);
Color.rgb=Value*mix(K.xxx,clamp(p-K.xxx,0.0,1.0),Saturation);
Color.a=Alpha;
}
void Fast_Fresnel_B272(
float Front_Reflect,
float Edge_Reflect,
float Power,
vec3 Normal,
vec3 Incident,
out float Transmit,
out float Reflect)
{
float d=max(-dot(Incident,Normal),0.0);
Reflect=Front_Reflect+(Edge_Reflect-Front_Reflect)*pow(1.0-d,Power);
Transmit=1.0-Reflect;
}
void Mapped_Environment_B201(
sampler2D Reflected_Environment,
sampler2D Indirect_Environment,
vec3 Dir,
out vec4 Reflected_Color,
out vec4 Indirect_Diffuse)
{
Reflected_Color=texture(Reflected_Environment,vec2(atan(Dir.z,Dir.x)/3.14159*0.5,asin(Dir.y)/3.14159+0.5));
Indirect_Diffuse=texture(Indirect_Environment,vec2(atan(Dir.z,Dir.x)/3.14159*0.5,asin(Dir.y)/3.14159+0.5));
}
vec4 SampleEnv_Bid200(vec3 D,vec4 S,vec4 H,vec4 G,float exponent)
{
float k=pow(abs(D.y),exponent);
vec4 C;
if (D.y>0.0) {
C=mix(H,S,k);
} else {
C=mix(H,G,k); 
}
return C;
}
void Sky_Environment_B200(
vec3 Normal,
vec3 Reflected,
vec4 Sky_Color,
vec4 Horizon_Color,
vec4 Ground_Color,
float Horizon_Power,
out vec4 Reflected_Color,
out vec4 Indirect_Color)
{
Reflected_Color=SampleEnv_Bid200(Reflected,Sky_Color,Horizon_Color,Ground_Color,Horizon_Power);
Indirect_Color=mix(Ground_Color,Sky_Color,Normal.y*0.5+0.5);
}
void Min_Segment_Distance_B215(
vec3 P0,
vec3 P1,
vec3 Q0,
vec3 Q1,
out vec3 NearP,
out vec3 NearQ,
out float Distance)
{
vec3 u=P1-P0;
vec3 v=Q1-Q0;
vec3 w=P0-Q0;
float a=dot(u,u);
float b=dot(u,v);
float c=dot(v,v);
float d=dot(u,w);
float e=dot(v,w);
float D=a*c-b*b;
float sD=D;
float tD=D;
float sc,sN,tc,tN;
if (D<0.00001) {
sN=0.0;
sD=1.0;
tN=e;
tD=c;
} else {
sN=(b*e-c*d);
tN=(a*e-b*d);
if (sN<0.0) {
sN=0.0;
tN=e;
tD=c;
} else if (sN>sD) {
sN=sD;
tN=e+b;
tD=c;
}
}
if (tN<0.0) {
tN=0.0;
if (-d<0.0) {
sN=0.0;
} else if (-d>a) {
sN=sD;
} else {
sN=-d;
sD=a;
}
} else if (tN>tD) {
tN=tD;
if ((-d+b)<0.0) {
sN=0.0;
} else if ((-d+b)>a) {
sN=sD;
} else {
sN=(-d+b);
sD=a;
}
}
sc=abs(sN)<0.000001 ? 0.0 : sN/sD;
tc=abs(tN)<0.000001 ? 0.0 : tN/tD;
NearP=P0+sc*u;
NearQ=Q0+tc*v;
Distance=distance(NearP,NearQ);
}
void To_XYZ_B224(
vec3 Vec3,
out float X,
out float Y,
out float Z)
{
X=Vec3.x;
Y=Vec3.y;
Z=Vec3.z;
}
void Finger_Positions_B214(
vec3 Left_Index_Pos,
vec3 Right_Index_Pos,
vec3 Left_Index_Middle_Pos,
vec3 Right_Index_Middle_Pos,
out vec3 Left_Index,
out vec3 Right_Index,
out vec3 Left_Index_Middle,
out vec3 Right_Index_Middle)
{
Left_Index= (Use_Global_Left_Index ? Global_Left_Index_Tip_Position.xyz : Left_Index_Pos);
Right_Index= (Use_Global_Right_Index ? Global_Right_Index_Tip_Position.xyz : Right_Index_Pos);
Left_Index_Middle= (Use_Global_Left_Index ? Global_Left_Index_Middle_Position.xyz : Left_Index_Middle_Pos);
Right_Index_Middle= (Use_Global_Right_Index ? Global_Right_Index_Middle_Position.xyz : Right_Index_Middle_Pos);
}
void VaryHSV_B258(
vec3 HSV_In,
float Hue_Shift,
float Saturation_Shift,
float Value_Shift,
out vec3 HSV_Out)
{
HSV_Out=vec3(fract(HSV_In.x+Hue_Shift),clamp(HSV_In.y+Saturation_Shift,0.0,1.0),clamp(HSV_In.z+Value_Shift,0.0,1.0));
}
void Remap_Range_B264(
float In_Min,
float In_Max,
float Out_Min,
float Out_Max,
float In,
out float Out)
{
Out=mix(Out_Min,Out_Max,clamp((In-In_Min)/(In_Max-In_Min),0.0,1.0));
}
void To_HSV_B225(
vec4 Color,
out float Hue,
out float Saturation,
out float Value,
out float Alpha,
out vec3 HSV)
{
vec4 K=vec4(0.0,-1.0/3.0,2.0/3.0,-1.0);
vec4 p=Color.g<Color.b ? vec4(Color.bg,K.wz) : vec4(Color.gb,K.xy);
vec4 q=Color.r<p.x ? vec4(p.xyw,Color.r) : vec4(Color.r,p.yzx);
float d=q.x-min(q.w,q.y);
float e=1.0e-10;
Hue=abs(q.z+(q.w-q.y)/(6.0*d+e));
Saturation=d/(q.x+e);
Value=q.x;
Alpha=Color.a;
HSV=vec3(Hue,Saturation,Value);
}
void Code_B260(
float X,
out float Result)
{
Result=(acos(X)/3.14159-0.5)*2.0;
}
void Rim_Light_B282(
vec3 Front,
vec3 Normal,
vec3 Incident,
float Rim_Intensity,
sampler2D Texture,
out vec4 Result)
{
vec3 R=reflect(Incident,Normal);
float RdotF=dot(R,Front);
float RdotL=sqrt(1.0-RdotF*RdotF);
vec2 UV=vec2(R.y*0.5+0.5,0.5);
vec4 Color=texture(Texture,UV);
Result=Color;
}
void main()
{
vec4 Blob_Color_Q180;
#if BLOB_ENABLE
Blob_Fragment_B180(_Blob_Texture_,vExtra2,vExtra3,Blob_Color_Q180);
#else
Blob_Color_Q180=vec4(0,0,0,0);
#endif
vec3 Incident_Q189=normalize(vPosition-cameraPosition);
vec3 Normalized_Q188=normalize(vNormal);
vec3 Normalized_Q221=normalize(vTangent);
vec4 Color_Q233;
#if DECAL_ENABLE
Color_Q233=texture(_Decal_,vUV);
#else
Color_Q233=vec4(0,0,0,0);
#endif
float X_Q240;
float Y_Q240;
float Z_Q240;
float W_Q240;
X_Q240=vExtra1.x;
Y_Q240=vExtra1.y;
Z_Q240=vExtra1.z;
W_Q240=vExtra1.w;
vec4 Linear_Q193;
Linear_Q193.rgb=clamp(_Sky_Color_.rgb*_Sky_Color_.rgb,0.0,1.0);
Linear_Q193.a=_Sky_Color_.a;
vec4 Linear_Q194;
Linear_Q194.rgb=clamp(_Horizon_Color_.rgb*_Horizon_Color_.rgb,0.0,1.0);
Linear_Q194.a=_Horizon_Color_.a;
vec4 Linear_Q195;
Linear_Q195.rgb=clamp(_Ground_Color_.rgb*_Ground_Color_.rgb,0.0,1.0);
Linear_Q195.a=_Ground_Color_.a;
vec3 Left_Index_Q214;
vec3 Right_Index_Q214;
vec3 Left_Index_Middle_Q214;
vec3 Right_Index_Middle_Q214;
Finger_Positions_B214(_Left_Index_Pos_,_Right_Index_Pos_,_Left_Index_Middle_Pos_,_Right_Index_Middle_Pos_,Left_Index_Q214,Right_Index_Q214,Left_Index_Middle_Q214,Right_Index_Middle_Q214);
vec4 Linear_Q196;
Linear_Q196.rgb=clamp(_Albedo_.rgb*_Albedo_.rgb,0.0,1.0);
Linear_Q196.a=_Albedo_.a;
vec3 Normalized_Q257=normalize(vBinormal);
vec3 Incident_Q220=normalize(vPosition-cameraPosition);
vec3 New_Normal_Q229;
Bulge_B229(_Bulge_Enabled_,Normalized_Q188,Normalized_Q221,_Bulge_Height_,vColor,_Bulge_Radius_,vBinormal,New_Normal_Q229);
float Result_Q227;
SSS_B227(vBinormal,New_Normal_Q229,Incident_Q189,Result_Q227);
vec4 Result_Q241;
Scale_Color_B241(Color_Q233,X_Q240,Result_Q241);
float Transmit_Q272;
float Reflect_Q272;
Fast_Fresnel_B272(_Front_Reflect_,_Edge_Reflect_,_Power_,New_Normal_Q229,Incident_Q189,Transmit_Q272,Reflect_Q272);
float Product_Q275=Y_Q240*Y_Q240;
vec3 NearP_Q215;
vec3 NearQ_Q215;
float Distance_Q215;
Min_Segment_Distance_B215(Left_Index_Q214,Left_Index_Middle_Q214,vPosition,cameraPosition,NearP_Q215,NearQ_Q215,Distance_Q215);
vec3 NearP_Q213;
vec3 NearQ_Q213;
float Distance_Q213;
Min_Segment_Distance_B215(Right_Index_Q214,Right_Index_Middle_Q214,vPosition,cameraPosition,NearP_Q213,NearQ_Q213,Distance_Q213);
vec3 Reflected_Q197=reflect(Incident_Q189,New_Normal_Q229);
vec4 Product_Q253=Linear_Q196*vec4(1,1,1,1);
vec4 Result_Q282;
Rim_Light_B282(Normalized_Q257,Normalized_Q188,Incident_Q220,_Rim_Intensity_,_Rim_Texture_,Result_Q282);
float Dot_Q222=dot(Incident_Q220, Normalized_Q221);
float MaxAB_Q273=max(Reflect_Q272,Product_Q275);
float NotInShadow_Q217;
#if OCCLUSION_ENABLED
FingerOcclusion_B217(_Width_,Distance_Q215,_Fuzz_,_Min_Fuzz_,vPosition,vBinormal,NearP_Q215,_Clip_Fade_,NotInShadow_Q217);
#else
NotInShadow_Q217=1.0;
#endif
float NotInShadow_Q218;
#if OCCLUSION_ENABLED
FingerOcclusion_B218(_Width_,Distance_Q213,_Fuzz_,_Min_Fuzz_,vPosition,vBinormal,NearP_Q213,_Clip_Fade_,NotInShadow_Q218);
#else
NotInShadow_Q218=1.0;
#endif
vec4 Reflected_Color_Q201;
vec4 Indirect_Diffuse_Q201;
#if ENV_ENABLE
Mapped_Environment_B201(_Reflection_Map_,_Indirect_Environment_,Reflected_Q197,Reflected_Color_Q201,Indirect_Diffuse_Q201);
#else
Reflected_Color_Q201=vec4(0,0,0,1);
Indirect_Diffuse_Q201=vec4(0,0,0,1);
#endif
vec4 Reflected_Color_Q200;
vec4 Indirect_Color_Q200;
#if SKY_ENABLED
Sky_Environment_B200(New_Normal_Q229,Reflected_Q197,Linear_Q193,Linear_Q194,Linear_Q195,_Horizon_Power_,Reflected_Color_Q200,Indirect_Color_Q200);
#else
Reflected_Color_Q200=vec4(0,0,0,1);
Indirect_Color_Q200=vec4(0,0,0,1);
#endif
float Hue_Q225;
float Saturation_Q225;
float Value_Q225;
float Alpha_Q225;
vec3 HSV_Q225;
To_HSV_B225(Product_Q253,Hue_Q225,Saturation_Q225,Value_Q225,Alpha_Q225,HSV_Q225);
float Hue_Q277;
float Saturation_Q277;
float Value_Q277;
float Alpha_Q277;
vec3 HSV_Q277;
To_HSV_B225(Result_Q282,Hue_Q277,Saturation_Q277,Value_Q277,Alpha_Q277,HSV_Q277);
float Result_Q260;
Code_B260(Dot_Q222,Result_Q260);
float AbsA_Q226=abs(Result_Q260);
float MinAB_Q208=min(NotInShadow_Q217,NotInShadow_Q218);
vec4 Sum_Q198=Reflected_Color_Q201+Reflected_Color_Q200;
vec4 Sum_Q199=Indirect_Diffuse_Q201+Indirect_Color_Q200;
vec3 HSV_Out_Q276;
VaryHSV_B258(HSV_Q277,_Rim_Hue_Shift_,_Rim_Saturation_Shift_,_Rim_Value_Shift_,HSV_Out_Q276);
float Out_Q264;
Remap_Range_B264(-1.0,1.0,0.0,1.0,Result_Q260,Out_Q264);
float Product_Q256;
Product_Q256=AbsA_Q226*_Hue_Shift_;
float X_Q278;
float Y_Q278;
float Z_Q278;
To_XYZ_B224(HSV_Out_Q276,X_Q278,Y_Q278,Z_Q278);
vec2 Vec2_Q262=vec2(Out_Q264,0.5);
vec3 HSV_Out_Q258;
VaryHSV_B258(HSV_Q225,Product_Q256,_Saturation_Shift_,_Value_Shift_,HSV_Out_Q258);
vec4 Color_Q279;
From_HSV_B223(X_Q278,Y_Q278,Z_Q278,0.0,Color_Q279);
vec4 Color_Q261;
#if IRIDESCENCE_ENABLED
Color_Q261=texture(_Iridescence_Texture_,Vec2_Q262);
#else
Color_Q261=vec4(0,0,0,0);
#endif
float X_Q224;
float Y_Q224;
float Z_Q224;
To_XYZ_B224(HSV_Out_Q258,X_Q224,Y_Q224,Z_Q224);
vec4 Result_Q281=_Rim_Intensity_*Color_Q279;
vec4 Result_Q263=_Iridescence_Intensity_*Color_Q261;
vec4 Color_Q223;
From_HSV_B223(X_Q224,Y_Q224,Z_Q224,0.0,Color_Q223);
vec4 Result_Q234=Result_Q241+(1.0-Result_Q241.a)*Color_Q223;
vec4 Result_Q271;
Fragment_Main_B271(_Sun_Intensity_,_Sun_Theta_,_Sun_Phi_,New_Normal_Q229,Result_Q234,MaxAB_Q273,_Shininess_,Incident_Q189,_Horizon_Color_,_Sky_Color_,_Ground_Color_,_Indirect_Diffuse_,_Specular_,_Horizon_Power_,_Reflection_,Sum_Q198,Sum_Q199,_Sharpness_,Result_Q227,_Subsurface_,vec4(0,0,0,0),Result_Q281,Result_Q263,Result_Q271);
vec4 Result_Q209;
Scale_RGB_B209(Result_Q271,MinAB_Q208,Result_Q209);
vec4 sRGB_Q192;
FastLinearTosRGB_B192(Result_Q209,sRGB_Q192);
vec4 Result_Q181=Blob_Color_Q180+(1.0-Blob_Color_Q180.a)*sRGB_Q192;
vec4 Result_Q190=Result_Q181; Result_Q190.a=1.0;
vec4 Out_Color=Result_Q190;
float Clip_Threshold=0.001;
bool To_sRGB=false;
gl_FragColor=Out_Color;
}`;st.ShadersStore[ss]=os;const rs="mrdlSliderThumbVertexShader",ns=`uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef TANGENT
attribute vec3 tangent;
#else
const vec3 tangent=vec3(0.);
#endif
uniform float _Radius_;
uniform float _Bevel_Front_;
uniform float _Bevel_Front_Stretch_;
uniform float _Bevel_Back_;
uniform float _Bevel_Back_Stretch_;
uniform float _Radius_Top_Left_;
uniform float _Radius_Top_Right_;
uniform float _Radius_Bottom_Left_;
uniform float _Radius_Bottom_Right_;
uniform bool _Bulge_Enabled_;
uniform float _Bulge_Height_;
uniform float _Bulge_Radius_;
uniform float _Sun_Intensity_;
uniform float _Sun_Theta_;
uniform float _Sun_Phi_;
uniform float _Indirect_Diffuse_;
uniform vec4 _Albedo_;
uniform float _Specular_;
uniform float _Shininess_;
uniform float _Sharpness_;
uniform float _Subsurface_;
uniform vec4 _Left_Color_;
uniform vec4 _Right_Color_;
uniform float _Reflection_;
uniform float _Front_Reflect_;
uniform float _Edge_Reflect_;
uniform float _Power_;
uniform vec4 _Sky_Color_;
uniform vec4 _Horizon_Color_;
uniform vec4 _Ground_Color_;
uniform float _Horizon_Power_;
uniform sampler2D _Reflection_Map_;
uniform sampler2D _Indirect_Environment_;
uniform float _Width_;
uniform float _Fuzz_;
uniform float _Min_Fuzz_;
uniform float _Clip_Fade_;
uniform float _Hue_Shift_;
uniform float _Saturation_Shift_;
uniform float _Value_Shift_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform sampler2D _Blob_Texture_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform vec3 _Left_Index_Pos_;
uniform vec3 _Right_Index_Pos_;
uniform vec3 _Left_Index_Middle_Pos_;
uniform vec3 _Right_Index_Middle_Pos_;
uniform sampler2D _Decal_;
uniform vec2 _Decal_Scale_XY_;
uniform bool _Decal_Front_Only_;
uniform float _Rim_Intensity_;
uniform sampler2D _Rim_Texture_;
uniform float _Rim_Hue_Shift_;
uniform float _Rim_Saturation_Shift_;
uniform float _Rim_Value_Shift_;
uniform float _Iridescence_Intensity_;
uniform sampler2D _Iridescence_Texture_;
uniform bool Use_Global_Left_Index;
uniform bool Use_Global_Right_Index;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
uniform vec4 Global_Left_Thumb_Tip_Position;
uniform vec4 Global_Right_Thumb_Tip_Position;
uniform float Global_Left_Index_Tip_Proximity;
uniform float Global_Right_Index_Tip_Proximity;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vColor;
varying vec4 vExtra1;
varying vec4 vExtra2;
varying vec4 vExtra3;
void Object_To_World_Pos_B162(
vec3 Pos_Object,
out vec3 Pos_World)
{
Pos_World=(world*vec4(Pos_Object,1.0)).xyz;
}
void Object_To_World_Normal_B182(
vec3 Nrm_Object,
out vec3 Nrm_World)
{
Nrm_World=(vec4(Nrm_Object,0.0)).xyz;
}
void Blob_Vertex_B173(
vec3 Position,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
vec3 Blob_Position,
float Intensity,
float Blob_Near_Size,
float Blob_Far_Size,
float Blob_Near_Distance,
float Blob_Far_Distance,
float Blob_Fade_Length,
float Blob_Pulse,
float Blob_Fade,
out vec4 Blob_Info)
{
vec3 blob= (Use_Global_Left_Index ? Global_Left_Index_Tip_Position.xyz : Blob_Position);
vec3 delta=blob-Position;
float dist=dot(Normal,delta);
float lerpValue=clamp((abs(dist)-Blob_Near_Distance)/(Blob_Far_Distance-Blob_Near_Distance),0.0,1.0);
float fadeValue=1.0-clamp((abs(dist)-Blob_Far_Distance)/Blob_Fade_Length,0.0,1.0);
float size=Blob_Near_Size+(Blob_Far_Size-Blob_Near_Size)*lerpValue;
vec2 blobXY=vec2(dot(delta,Tangent),dot(delta,Bitangent))/(0.0001+size);
float Fade=fadeValue*Intensity*Blob_Fade;
float Distance=(lerpValue*0.5+0.5)*(1.0-Blob_Pulse);
Blob_Info=vec4(blobXY.x,blobXY.y,Distance,Fade);
}
void Blob_Vertex_B174(
vec3 Position,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
vec3 Blob_Position,
float Intensity,
float Blob_Near_Size,
float Blob_Far_Size,
float Blob_Near_Distance,
float Blob_Far_Distance,
float Blob_Fade_Length,
float Blob_Pulse,
float Blob_Fade,
out vec4 Blob_Info)
{
vec3 blob= (Use_Global_Right_Index ? Global_Right_Index_Tip_Position.xyz : Blob_Position);
vec3 delta=blob-Position;
float dist=dot(Normal,delta);
float lerpValue=clamp((abs(dist)-Blob_Near_Distance)/(Blob_Far_Distance-Blob_Near_Distance),0.0,1.0);
float fadeValue=1.0-clamp((abs(dist)-Blob_Far_Distance)/Blob_Fade_Length,0.0,1.0);
float size=Blob_Near_Size+(Blob_Far_Size-Blob_Near_Size)*lerpValue;
vec2 blobXY=vec2(dot(delta,Tangent),dot(delta,Bitangent))/(0.0001+size);
float Fade=fadeValue*Intensity*Blob_Fade;
float Distance=(lerpValue*0.5+0.5)*(1.0-Blob_Pulse);
Blob_Info=vec4(blobXY.x,blobXY.y,Distance,Fade);
}
void Move_Verts_B280(
float Anisotropy,
vec3 P,
float Radius,
float Bevel,
vec3 Normal_Object,
float ScaleZ,
float Stretch,
out vec3 New_P,
out vec2 New_UV,
out float Radial_Gradient,
out vec3 Radial_Dir,
out vec3 New_Normal)
{
vec2 UV=P.xy*2.0+0.5;
vec2 center=clamp(UV,0.0,1.0);
vec2 delta=UV-center;
float deltad=(length(delta)*2.0);
float f=(Bevel+(Radius-Bevel)*Stretch)/Radius;
float innerd=clamp(deltad*2.0,0.0,1.0);
float outerd=clamp(deltad*2.0-1.0,0.0,1.0);
float bevelAngle=outerd*3.14159*0.5;
float sinb=sin(bevelAngle);
float cosb=cos(bevelAngle);
float beveld=(1.0-f)*innerd+f*sinb;
float br=outerd;
vec2 r2=2.0*vec2(Radius/Anisotropy,Radius);
float dir=P.z<0.0001 ? 1.0 : -1.0;
New_UV=center+r2*((0.5-center)+normalize(delta+vec2(0.0,0.000001))*beveld*0.5);
New_P=vec3(New_UV-0.5,P.z+dir*(1.0-cosb)*Bevel*ScaleZ);
Radial_Gradient=clamp((deltad-0.5)*2.0,0.0,1.0);
Radial_Dir=vec3(delta*r2,0.0);
vec3 beveledNormal=cosb*Normal_Object+sinb*vec3(delta.x,delta.y,0.0);
New_Normal=Normal_Object.z==0.0 ? Normal_Object : beveledNormal;
}
void Object_To_World_Dir_B210(
vec3 Dir_Object,
out vec3 Normal_World,
out vec3 Normal_World_N,
out float Normal_Length)
{
Normal_World=(world*vec4(Dir_Object,0.0)).xyz;
Normal_Length=length(Normal_World);
Normal_World_N=Normal_World/Normal_Length;
}
void To_XYZ_B228(
vec3 Vec3,
out float X,
out float Y,
out float Z)
{
X=Vec3.x;
Y=Vec3.y;
Z=Vec3.z;
}
void Conditional_Float_B243(
bool Which,
float If_True,
float If_False,
out float Result)
{
Result=Which ? If_True : If_False;
}
void Object_To_World_Dir_B178(
vec3 Dir_Object,
out vec3 Binormal_World,
out vec3 Binormal_World_N,
out float Binormal_Length)
{
Binormal_World=(world*vec4(Dir_Object,0.0)).xyz;
Binormal_Length=length(Binormal_World);
Binormal_World_N=Binormal_World/Binormal_Length;
}
void Pick_Radius_B219(
float Radius,
float Radius_Top_Left,
float Radius_Top_Right,
float Radius_Bottom_Left,
float Radius_Bottom_Right,
vec3 Position,
out float Result)
{
bool whichY=Position.y>0.0;
Result=Position.x<0.0 ? (whichY ? Radius_Top_Left : Radius_Bottom_Left) : (whichY ? Radius_Top_Right : Radius_Bottom_Right);
Result*=Radius;
}
void Conditional_Float_B186(
bool Which,
float If_True,
float If_False,
out float Result)
{
Result=Which ? If_True : If_False;
}
void Greater_Than_B187(
float Left,
float Right,
out bool Not_Greater_Than,
out bool Greater_Than)
{
Greater_Than=Left>Right;
Not_Greater_Than=!Greater_Than;
}
void Remap_Range_B255(
float In_Min,
float In_Max,
float Out_Min,
float Out_Max,
float In,
out float Out)
{
Out=mix(Out_Min,Out_Max,clamp((In-In_Min)/(In_Max-In_Min),0.0,1.0));
}
void main()
{
vec2 XY_Q235;
XY_Q235=(uv-vec2(0.5,0.5))*_Decal_Scale_XY_+vec2(0.5,0.5);
vec3 Tangent_World_Q177;
vec3 Tangent_World_N_Q177;
float Tangent_Length_Q177;
Tangent_World_Q177=(world*vec4(vec3(1,0,0),0.0)).xyz;
Tangent_Length_Q177=length(Tangent_World_Q177);
Tangent_World_N_Q177=Tangent_World_Q177/Tangent_Length_Q177;
vec3 Normal_World_Q210;
vec3 Normal_World_N_Q210;
float Normal_Length_Q210;
Object_To_World_Dir_B210(vec3(0,0,1),Normal_World_Q210,Normal_World_N_Q210,Normal_Length_Q210);
float X_Q228;
float Y_Q228;
float Z_Q228;
To_XYZ_B228(position,X_Q228,Y_Q228,Z_Q228);
vec3 Nrm_World_Q176;
Nrm_World_Q176=normalize((world*vec4(normal,0.0)).xyz);
vec3 Binormal_World_Q178;
vec3 Binormal_World_N_Q178;
float Binormal_Length_Q178;
Object_To_World_Dir_B178(vec3(0,1,0),Binormal_World_Q178,Binormal_World_N_Q178,Binormal_Length_Q178);
float Anisotropy_Q179=Tangent_Length_Q177/Binormal_Length_Q178;
float Result_Q219;
Pick_Radius_B219(_Radius_,_Radius_Top_Left_,_Radius_Top_Right_,_Radius_Bottom_Left_,_Radius_Bottom_Right_,position,Result_Q219);
float Anisotropy_Q203=Binormal_Length_Q178/Normal_Length_Q210;
bool Not_Greater_Than_Q187;
bool Greater_Than_Q187;
Greater_Than_B187(Z_Q228,0.0,Not_Greater_Than_Q187,Greater_Than_Q187);
vec4 Linear_Q251;
Linear_Q251.rgb=clamp(_Left_Color_.rgb*_Left_Color_.rgb,0.0,1.0);
Linear_Q251.a=_Left_Color_.a;
vec4 Linear_Q252;
Linear_Q252.rgb=clamp(_Right_Color_.rgb*_Right_Color_.rgb,0.0,1.0);
Linear_Q252.a=_Right_Color_.a;
vec3 Difference_Q211=vec3(0,0,0)-Normal_World_N_Q210;
vec4 Out_Color_Q184=vec4(X_Q228,Y_Q228,Z_Q228,1);
float Result_Q186;
Conditional_Float_B186(Greater_Than_Q187,_Bevel_Back_,_Bevel_Front_,Result_Q186);
float Result_Q244;
Conditional_Float_B186(Greater_Than_Q187,_Bevel_Back_Stretch_,_Bevel_Front_Stretch_,Result_Q244);
vec3 New_P_Q280;
vec2 New_UV_Q280;
float Radial_Gradient_Q280;
vec3 Radial_Dir_Q280;
vec3 New_Normal_Q280;
Move_Verts_B280(Anisotropy_Q179,position,Result_Q219,Result_Q186,normal,Anisotropy_Q203,Result_Q244,New_P_Q280,New_UV_Q280,Radial_Gradient_Q280,Radial_Dir_Q280,New_Normal_Q280);
float X_Q248;
float Y_Q248;
X_Q248=New_UV_Q280.x;
Y_Q248=New_UV_Q280.y;
vec3 Pos_World_Q162;
Object_To_World_Pos_B162(New_P_Q280,Pos_World_Q162);
vec3 Nrm_World_Q182;
Object_To_World_Normal_B182(New_Normal_Q280,Nrm_World_Q182);
vec4 Blob_Info_Q173;
#if BLOB_ENABLE
Blob_Vertex_B173(Pos_World_Q162,Nrm_World_Q176,Tangent_World_N_Q177,Binormal_World_N_Q178,_Blob_Position_,_Blob_Intensity_,_Blob_Near_Size_,_Blob_Far_Size_,_Blob_Near_Distance_,_Blob_Far_Distance_,_Blob_Fade_Length_,_Blob_Pulse_,_Blob_Fade_,Blob_Info_Q173);
#else
Blob_Info_Q173=vec4(0,0,0,0);
#endif
vec4 Blob_Info_Q174;
#if BLOB_ENABLE_2
Blob_Vertex_B174(Pos_World_Q162,Nrm_World_Q176,Tangent_World_N_Q177,Binormal_World_N_Q178,_Blob_Position_2_,_Blob_Intensity_,_Blob_Near_Size_2_,_Blob_Far_Size_,_Blob_Near_Distance_,_Blob_Far_Distance_,_Blob_Fade_Length_,_Blob_Pulse_2_,_Blob_Fade_2_,Blob_Info_Q174);
#else
Blob_Info_Q174=vec4(0,0,0,0);
#endif
float Out_Q255;
Remap_Range_B255(0.0,1.0,0.0,1.0,X_Q248,Out_Q255);
float X_Q236;
float Y_Q236;
float Z_Q236;
To_XYZ_B228(Nrm_World_Q182,X_Q236,Y_Q236,Z_Q236);
vec4 Color_At_T_Q247=mix(Linear_Q251,Linear_Q252,Out_Q255);
float Minus_F_Q237=-Z_Q236;
float R_Q249;
float G_Q249;
float B_Q249;
float A_Q249;
R_Q249=Color_At_T_Q247.r; G_Q249=Color_At_T_Q247.g; B_Q249=Color_At_T_Q247.b; A_Q249=Color_At_T_Q247.a;
float ClampF_Q238=clamp(0.0,Minus_F_Q237,1.0);
float Result_Q243;
Conditional_Float_B243(_Decal_Front_Only_,ClampF_Q238,1.0,Result_Q243);
vec4 Vec4_Q239=vec4(Result_Q243,Radial_Gradient_Q280,G_Q249,B_Q249);
vec3 Position=Pos_World_Q162;
vec3 Normal=Nrm_World_Q182;
vec2 UV=XY_Q235;
vec3 Tangent=Tangent_World_N_Q177;
vec3 Binormal=Difference_Q211;
vec4 Color=Out_Color_Q184;
vec4 Extra1=Vec4_Q239;
vec4 Extra2=Blob_Info_Q173;
vec4 Extra3=Blob_Info_Q174;
gl_Position=viewProjection*vec4(Position,1);
vPosition=Position;
vNormal=Normal;
vUV=UV;
vTangent=Tangent;
vBinormal=Binormal;
vColor=Color;
vExtra1=Extra1;
vExtra2=Extra2;
vExtra3=Extra3;
}`;st.ShadersStore[rs]=ns;class as extends Wt{constructor(){super(),this.SKY_ENABLED=!0,this.BLOB_ENABLE_2=!0,this.IRIDESCENCE_ENABLED=!0,this._needNormals=!0,this._needUVs=!0,this.rebuild()}}class v extends zt{constructor(t,e){super(t,e),this.radius=.157,this.bevelFront=.065,this.bevelFrontStretch=.077,this.bevelBack=.031,this.bevelBackStretch=0,this.radiusTopLeft=1,this.radiusTopRight=1,this.radiusBottomLeft=1,this.radiusBottomRight=1,this.bulgeEnabled=!1,this.bulgeHeight=-.323,this.bulgeRadius=.73,this.sunIntensity=2,this.sunTheta=.937,this.sunPhi=.555,this.indirectDiffuse=1,this.albedo=new M(.0117647,.505882,.996078,1),this.specular=0,this.shininess=10,this.sharpness=0,this.subsurface=.31,this.leftGradientColor=new M(.0117647,.505882,.996078,1),this.rightGradientColor=new M(.0117647,.505882,.996078,1),this.reflection=.749,this.frontReflect=0,this.edgeReflect=.09,this.power=8.1,this.skyColor=new M(.0117647,.960784,.996078,1),this.horizonColor=new M(.0117647,.333333,.996078,1),this.groundColor=new M(0,.254902,.996078,1),this.horizonPower=1,this.width=.02,this.fuzz=.5,this.minFuzz=.001,this.clipFade=.01,this.hueShift=0,this.saturationShift=0,this.valueShift=0,this.blobPosition=new D(0,0,.1),this.blobIntensity=.5,this.blobNearSize=.01,this.blobFarSize=.03,this.blobNearDistance=0,this.blobFarDistance=.08,this.blobFadeLength=.576,this.blobPulse=0,this.blobFade=1,this.blobPosition2=new D(.2,0,.1),this.blobNearSize2=.01,this.blobPulse2=0,this.blobFade2=1,this.blobTexture=new O("",this.getScene()),this.leftIndexPosition=new D(0,0,1),this.rightIndexPosition=new D(-1,-1,-1),this.leftIndexMiddlePosition=new D(0,0,0),this.rightIndexMiddlePosition=new D(0,0,0),this.decalScaleXY=new W(1.5,1.5),this.decalFrontOnly=!0,this.rimIntensity=.287,this.rimHueShift=0,this.rimSaturationShift=0,this.rimValueShift=-1,this.iridescenceIntensity=0,this.useGlobalLeftIndex=1,this.useGlobalRightIndex=1,this.globalLeftIndexTipProximity=0,this.globalRightIndexTipProximity=0,this.globalLeftIndexTipPosition=new rt(.5,0,-.55,1),this.globaRightIndexTipPosition=new rt(0,0,0,1),this.globalLeftThumbTipPosition=new rt(.5,0,-.55,1),this.globalRightThumbTipPosition=new rt(0,0,0,1),this.globalLeftIndexMiddlePosition=new rt(.5,0,-.55,1),this.globalRightIndexMiddlePosition=new rt(0,0,0,1),this.alphaMode=Rt.ALPHA_DISABLE,this.backFaceCulling=!1,this._blueGradientTexture=new O(v.BLUE_GRADIENT_TEXTURE_URL,e,!0,!1,O.NEAREST_SAMPLINGMODE),this._decalTexture=new O("",this.getScene()),this._reflectionMapTexture=new O("",this.getScene()),this._indirectEnvTexture=new O("",this.getScene())}needAlphaBlending(){return!1}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(t,e){if(this.isFrozen&&e.effect&&e.effect._wasPreviouslyReady)return!0;e.materialDefines||(e.materialDefines=new as);const i=e.materialDefines,s=this.getScene();if(this._isReadyForSubMesh(e))return!0;const o=s.getEngine();if(L.PrepareDefinesForAttributes(t,i,!1,!1),i.isDirty){i.markAsProcessed(),s.resetCachedMaterial();const r=new qt;i.FOG&&r.addFallback(1,"FOG"),L.HandleFallbacksForShadows(i,r),i.IMAGEPROCESSINGPOSTPROCESS=s.imageProcessingConfiguration.applyByPostProcess;const a=[B.PositionKind];i.NORMAL&&a.push(B.NormalKind),i.UV1&&a.push(B.UVKind),i.UV2&&a.push(B.UV2Kind),i.VERTEXCOLOR&&a.push(B.ColorKind),i.TANGENT&&a.push(B.TangentKind),L.PrepareAttributesForInstances(a,i);const l="mrdlSliderThumb",h=i.toString(),f=["world","viewProjection","cameraPosition","_Radius_","_Bevel_Front_","_Bevel_Front_Stretch_","_Bevel_Back_","_Bevel_Back_Stretch_","_Radius_Top_Left_","_Radius_Top_Right_","_Radius_Bottom_Left_","_Radius_Bottom_Right_","_Bulge_Enabled_","_Bulge_Height_","_Bulge_Radius_","_Sun_Intensity_","_Sun_Theta_","_Sun_Phi_","_Indirect_Diffuse_","_Albedo_","_Specular_","_Shininess_","_Sharpness_","_Subsurface_","_Left_Color_","_Right_Color_","_Reflection_","_Front_Reflect_","_Edge_Reflect_","_Power_","_Sky_Color_","_Horizon_Color_","_Ground_Color_","_Horizon_Power_","_Reflection_Map_","_Indirect_Environment_","_Width_","_Fuzz_","_Min_Fuzz_","_Clip_Fade_","_Hue_Shift_","_Saturation_Shift_","_Value_Shift_","_Blob_Position_","_Blob_Intensity_","_Blob_Near_Size_","_Blob_Far_Size_","_Blob_Near_Distance_","_Blob_Far_Distance_","_Blob_Fade_Length_","_Blob_Pulse_","_Blob_Fade_","_Blob_Texture_","_Blob_Position_2_","_Blob_Near_Size_2_","_Blob_Pulse_2_","_Blob_Fade_2_","_Left_Index_Pos_","_Right_Index_Pos_","_Left_Index_Middle_Pos_","_Right_Index_Middle_Pos_","_Decal_","_Decal_Scale_XY_","_Decal_Front_Only_","_Rim_Intensity_","_Rim_Texture_","_Rim_Hue_Shift_","_Rim_Saturation_Shift_","_Rim_Value_Shift_","_Iridescence_Intensity_","_Iridescence_Texture_","Use_Global_Left_Index","Use_Global_Right_Index","Global_Left_Index_Tip_Position","Global_Right_Index_Tip_Position","Global_Left_Thumb_Tip_Position","Global_Right_Thumb_Tip_Position","Global_Left_Index_Middle_Position;","Global_Right_Index_Middle_Position","Global_Left_Index_Tip_Proximity","Global_Right_Index_Tip_Proximity"],d=["_Rim_Texture_","_Iridescence_Texture_"],u=new Array;L.PrepareUniformsAndSamplersList({uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:i,maxSimultaneousLights:4}),e.setEffect(s.getEngine().createEffect(l,{attributes:a,uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:h,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),i)}return!e.effect||!e.effect.isReady()?!1:(i._renderId=s.getRenderId(),e.effect._wasPreviouslyReady=!0,!0)}bindForSubMesh(t,e,i){if(!i.materialDefines)return;const o=i.effect;o&&(this._activeEffect=o,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("viewProjection",this.getScene().getTransformMatrix()),this._activeEffect.setVector3("cameraPosition",this.getScene().activeCamera.position),this._activeEffect.setFloat("_Radius_",this.radius),this._activeEffect.setFloat("_Bevel_Front_",this.bevelFront),this._activeEffect.setFloat("_Bevel_Front_Stretch_",this.bevelFrontStretch),this._activeEffect.setFloat("_Bevel_Back_",this.bevelBack),this._activeEffect.setFloat("_Bevel_Back_Stretch_",this.bevelBackStretch),this._activeEffect.setFloat("_Radius_Top_Left_",this.radiusTopLeft),this._activeEffect.setFloat("_Radius_Top_Right_",this.radiusTopRight),this._activeEffect.setFloat("_Radius_Bottom_Left_",this.radiusBottomLeft),this._activeEffect.setFloat("_Radius_Bottom_Right_",this.radiusBottomRight),this._activeEffect.setFloat("_Bulge_Enabled_",this.bulgeEnabled?1:0),this._activeEffect.setFloat("_Bulge_Height_",this.bulgeHeight),this._activeEffect.setFloat("_Bulge_Radius_",this.bulgeRadius),this._activeEffect.setFloat("_Sun_Intensity_",this.sunIntensity),this._activeEffect.setFloat("_Sun_Theta_",this.sunTheta),this._activeEffect.setFloat("_Sun_Phi_",this.sunPhi),this._activeEffect.setFloat("_Indirect_Diffuse_",this.indirectDiffuse),this._activeEffect.setDirectColor4("_Albedo_",this.albedo),this._activeEffect.setFloat("_Specular_",this.specular),this._activeEffect.setFloat("_Shininess_",this.shininess),this._activeEffect.setFloat("_Sharpness_",this.sharpness),this._activeEffect.setFloat("_Subsurface_",this.subsurface),this._activeEffect.setDirectColor4("_Left_Color_",this.leftGradientColor),this._activeEffect.setDirectColor4("_Right_Color_",this.rightGradientColor),this._activeEffect.setFloat("_Reflection_",this.reflection),this._activeEffect.setFloat("_Front_Reflect_",this.frontReflect),this._activeEffect.setFloat("_Edge_Reflect_",this.edgeReflect),this._activeEffect.setFloat("_Power_",this.power),this._activeEffect.setDirectColor4("_Sky_Color_",this.skyColor),this._activeEffect.setDirectColor4("_Horizon_Color_",this.horizonColor),this._activeEffect.setDirectColor4("_Ground_Color_",this.groundColor),this._activeEffect.setFloat("_Horizon_Power_",this.horizonPower),this._activeEffect.setTexture("_Reflection_Map_",this._reflectionMapTexture),this._activeEffect.setTexture("_Indirect_Environment_",this._indirectEnvTexture),this._activeEffect.setFloat("_Width_",this.width),this._activeEffect.setFloat("_Fuzz_",this.fuzz),this._activeEffect.setFloat("_Min_Fuzz_",this.minFuzz),this._activeEffect.setFloat("_Clip_Fade_",this.clipFade),this._activeEffect.setFloat("_Hue_Shift_",this.hueShift),this._activeEffect.setFloat("_Saturation_Shift_",this.saturationShift),this._activeEffect.setFloat("_Value_Shift_",this.valueShift),this._activeEffect.setVector3("_Blob_Position_",this.blobPosition),this._activeEffect.setFloat("_Blob_Intensity_",this.blobIntensity),this._activeEffect.setFloat("_Blob_Near_Size_",this.blobNearSize),this._activeEffect.setFloat("_Blob_Far_Size_",this.blobFarSize),this._activeEffect.setFloat("_Blob_Near_Distance_",this.blobNearDistance),this._activeEffect.setFloat("_Blob_Far_Distance_",this.blobFarDistance),this._activeEffect.setFloat("_Blob_Fade_Length_",this.blobFadeLength),this._activeEffect.setFloat("_Blob_Pulse_",this.blobPulse),this._activeEffect.setFloat("_Blob_Fade_",this.blobFade),this._activeEffect.setTexture("_Blob_Texture_",this.blobTexture),this._activeEffect.setVector3("_Blob_Position_2_",this.blobPosition2),this._activeEffect.setFloat("_Blob_Near_Size_2_",this.blobNearSize2),this._activeEffect.setFloat("_Blob_Pulse_2_",this.blobPulse2),this._activeEffect.setFloat("_Blob_Fade_2_",this.blobFade2),this._activeEffect.setVector3("_Left_Index_Pos_",this.leftIndexPosition),this._activeEffect.setVector3("_Right_Index_Pos_",this.rightIndexPosition),this._activeEffect.setVector3("_Left_Index_Middle_Pos_",this.leftIndexMiddlePosition),this._activeEffect.setVector3("_Right_Index_Middle_Pos_",this.rightIndexMiddlePosition),this._activeEffect.setTexture("_Decal_",this._decalTexture),this._activeEffect.setVector2("_Decal_Scale_XY_",this.decalScaleXY),this._activeEffect.setFloat("_Decal_Front_Only_",this.decalFrontOnly?1:0),this._activeEffect.setFloat("_Rim_Intensity_",this.rimIntensity),this._activeEffect.setTexture("_Rim_Texture_",this._blueGradientTexture),this._activeEffect.setFloat("_Rim_Hue_Shift_",this.rimHueShift),this._activeEffect.setFloat("_Rim_Saturation_Shift_",this.rimSaturationShift),this._activeEffect.setFloat("_Rim_Value_Shift_",this.rimValueShift),this._activeEffect.setFloat("_Iridescence_Intensity_",this.iridescenceIntensity),this._activeEffect.setTexture("_Iridescence_Texture_",this._blueGradientTexture),this._activeEffect.setFloat("Use_Global_Left_Index",this.useGlobalLeftIndex),this._activeEffect.setFloat("Use_Global_Right_Index",this.useGlobalRightIndex),this._activeEffect.setVector4("Global_Left_Index_Tip_Position",this.globalLeftIndexTipPosition),this._activeEffect.setVector4("Global_Right_Index_Tip_Position",this.globaRightIndexTipPosition),this._activeEffect.setVector4("Global_Left_Thumb_Tip_Position",this.globalLeftThumbTipPosition),this._activeEffect.setVector4("Global_Right_Thumb_Tip_Position",this.globalRightThumbTipPosition),this._activeEffect.setVector4("Global_Left_Index_Middle_Position",this.globalLeftIndexMiddlePosition),this._activeEffect.setVector4("Global_Right_Index_Middle_Position",this.globalRightIndexMiddlePosition),this._activeEffect.setFloat("Global_Left_Index_Tip_Proximity",this.globalLeftIndexTipProximity),this._activeEffect.setFloat("Global_Right_Index_Tip_Proximity",this.globalRightIndexTipProximity),this._afterBind(e,this._activeEffect))}getAnimatables(){return[]}dispose(t){super.dispose(t),this._reflectionMapTexture.dispose(),this._indirectEnvTexture.dispose(),this._blueGradientTexture.dispose(),this._decalTexture.dispose()}clone(t){return H.Clone(()=>new v(t,this.getScene()),this)}serialize(){const t=super.serialize();return t.customType="BABYLON.MRDLSliderThumbMaterial",t}getClassName(){return"MRDLSliderThumbMaterial"}static Parse(t,e,i){return H.Parse(()=>new v(t.name,e),t,e,i)}}v.BLUE_GRADIENT_TEXTURE_URL="https://assets.babylonjs.com/meshes/MRTK/MRDL/mrtk-mrdl-blue-gradient.png";n([_()],v.prototype,"radius",void 0);n([_()],v.prototype,"bevelFront",void 0);n([_()],v.prototype,"bevelFrontStretch",void 0);n([_()],v.prototype,"bevelBack",void 0);n([_()],v.prototype,"bevelBackStretch",void 0);n([_()],v.prototype,"radiusTopLeft",void 0);n([_()],v.prototype,"radiusTopRight",void 0);n([_()],v.prototype,"radiusBottomLeft",void 0);n([_()],v.prototype,"radiusBottomRight",void 0);n([_()],v.prototype,"bulgeEnabled",void 0);n([_()],v.prototype,"bulgeHeight",void 0);n([_()],v.prototype,"bulgeRadius",void 0);n([_()],v.prototype,"sunIntensity",void 0);n([_()],v.prototype,"sunTheta",void 0);n([_()],v.prototype,"sunPhi",void 0);n([_()],v.prototype,"indirectDiffuse",void 0);n([_()],v.prototype,"albedo",void 0);n([_()],v.prototype,"specular",void 0);n([_()],v.prototype,"shininess",void 0);n([_()],v.prototype,"sharpness",void 0);n([_()],v.prototype,"subsurface",void 0);n([_()],v.prototype,"leftGradientColor",void 0);n([_()],v.prototype,"rightGradientColor",void 0);n([_()],v.prototype,"reflection",void 0);n([_()],v.prototype,"frontReflect",void 0);n([_()],v.prototype,"edgeReflect",void 0);n([_()],v.prototype,"power",void 0);n([_()],v.prototype,"skyColor",void 0);n([_()],v.prototype,"horizonColor",void 0);n([_()],v.prototype,"groundColor",void 0);n([_()],v.prototype,"horizonPower",void 0);n([_()],v.prototype,"width",void 0);n([_()],v.prototype,"fuzz",void 0);n([_()],v.prototype,"minFuzz",void 0);n([_()],v.prototype,"clipFade",void 0);n([_()],v.prototype,"hueShift",void 0);n([_()],v.prototype,"saturationShift",void 0);n([_()],v.prototype,"valueShift",void 0);n([_()],v.prototype,"blobPosition",void 0);n([_()],v.prototype,"blobIntensity",void 0);n([_()],v.prototype,"blobNearSize",void 0);n([_()],v.prototype,"blobFarSize",void 0);n([_()],v.prototype,"blobNearDistance",void 0);n([_()],v.prototype,"blobFarDistance",void 0);n([_()],v.prototype,"blobFadeLength",void 0);n([_()],v.prototype,"blobPulse",void 0);n([_()],v.prototype,"blobFade",void 0);n([_()],v.prototype,"blobPosition2",void 0);n([_()],v.prototype,"blobNearSize2",void 0);n([_()],v.prototype,"blobPulse2",void 0);n([_()],v.prototype,"blobFade2",void 0);n([_()],v.prototype,"blobTexture",void 0);n([_()],v.prototype,"leftIndexPosition",void 0);n([_()],v.prototype,"rightIndexPosition",void 0);n([_()],v.prototype,"leftIndexMiddlePosition",void 0);n([_()],v.prototype,"rightIndexMiddlePosition",void 0);n([_()],v.prototype,"decalScaleXY",void 0);n([_()],v.prototype,"decalFrontOnly",void 0);n([_()],v.prototype,"rimIntensity",void 0);n([_()],v.prototype,"rimHueShift",void 0);n([_()],v.prototype,"rimSaturationShift",void 0);n([_()],v.prototype,"rimValueShift",void 0);n([_()],v.prototype,"iridescenceIntensity",void 0);F("BABYLON.GUI.MRDLSliderThumbMaterial",v);const _s="mrdlBackplatePixelShader",ls=`uniform vec3 cameraPosition;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vExtra1;
varying vec4 vExtra2;
uniform float _Radius_;
uniform float _Line_Width_;
uniform bool _Absolute_Sizes_;
uniform float _Filter_Width_;
uniform vec4 _Base_Color_;
uniform vec4 _Line_Color_;
uniform float _Radius_Top_Left_;
uniform float _Radius_Top_Right_;
uniform float _Radius_Bottom_Left_;
uniform float _Radius_Bottom_Right_;
uniform float _Rate_;
uniform vec4 _Highlight_Color_;
uniform float _Highlight_Width_;
uniform vec4 _Highlight_Transform_;
uniform float _Highlight_;
uniform float _Iridescence_Intensity_;
uniform float _Iridescence_Edge_Intensity_;
uniform vec4 _Iridescence_Tint_;
uniform sampler2D _Iridescent_Map_;
uniform float _Angle_;
uniform bool _Reflected_;
uniform float _Frequency_;
uniform float _Vertical_Offset_;
uniform vec4 _Gradient_Color_;
uniform vec4 _Top_Left_;
uniform vec4 _Top_Right_;
uniform vec4 _Bottom_Left_;
uniform vec4 _Bottom_Right_;
uniform float _Edge_Width_;
uniform float _Edge_Power_;
uniform float _Line_Gradient_Blend_;
uniform float _Fade_Out_;
void FastLinearTosRGB_B353(
vec4 Linear,
out vec4 sRGB)
{
sRGB.rgb=sqrt(clamp(Linear.rgb,0.0,1.0));
sRGB.a=Linear.a;
}
void Round_Rect_Fragment_B332(
float Radius,
float Line_Width,
vec4 Line_Color,
float Filter_Width,
vec2 UV,
float Line_Visibility,
vec4 Rect_Parms,
vec4 Fill_Color,
out vec4 Color)
{
float d=length(max(abs(UV)-Rect_Parms.xy,0.0));
float dx=max(fwidth(d)*Filter_Width,0.00001);
float g=min(Rect_Parms.z,Rect_Parms.w);
float dgrad=max(fwidth(g)*Filter_Width,0.00001);
float Inside_Rect=clamp(g/dgrad,0.0,1.0);
float inner=clamp((d+dx*0.5-max(Radius-Line_Width,d-dx*0.5))/dx,0.0,1.0);
Color=clamp(mix(Fill_Color,Line_Color,inner),0.0,1.0)*Inside_Rect;
}
void Iridescence_B343(
vec3 Position,
vec3 Normal,
vec2 UV,
vec3 Axis,
vec3 Eye,
vec4 Tint,
sampler2D Texture,
bool Reflected,
float Frequency,
float Vertical_Offset,
out vec4 Color)
{
vec3 i=normalize(Position-Eye);
vec3 r=reflect(i,Normal);
float idota=dot(i,Axis);
float idotr=dot(i,r);
float x=Reflected ? idotr : idota;
vec2 xy;
xy.x=fract((x*Frequency+1.0)*0.5+UV.y*Vertical_Offset);
xy.y=0.5;
Color=texture(Texture,xy);
Color.rgb*=Tint.rgb;
}
void Scale_RGB_B346(
vec4 Color,
float Scalar,
out vec4 Result)
{
Result=vec4(Scalar,Scalar,Scalar,1)*Color;
}
void Scale_RGB_B344(
float Scalar,
vec4 Color,
out vec4 Result)
{
Result=vec4(Scalar,Scalar,Scalar,1)*Color;
}
void Line_Fragment_B362(
vec4 Base_Color,
vec4 Highlight_Color,
float Highlight_Width,
vec3 Line_Vertex,
float Highlight,
out vec4 Line_Color)
{
float k2=1.0-clamp(abs(Line_Vertex.y/Highlight_Width),0.0,1.0);
Line_Color=mix(Base_Color,Highlight_Color,Highlight*k2);
}
void Edge_B356(
vec4 RectParms,
float Radius,
float Line_Width,
vec2 UV,
float Edge_Width,
float Edge_Power,
out float Result)
{
float d=length(max(abs(UV)-RectParms.xy,0.0));
float edge=1.0-clamp((1.0-d/(Radius-Line_Width))/Edge_Width,0.0,1.0);
Result=pow(edge,Edge_Power);
}
void Gradient_B355(
vec4 Gradient_Color,
vec4 Top_Left,
vec4 Top_Right,
vec4 Bottom_Left,
vec4 Bottom_Right,
vec2 UV,
out vec4 Result)
{
vec3 top=Top_Left.rgb+(Top_Right.rgb-Top_Left.rgb)*UV.x;
vec3 bottom=Bottom_Left.rgb+(Bottom_Right.rgb-Bottom_Left.rgb)*UV.x;
Result.rgb=Gradient_Color.rgb*(bottom+(top-bottom)*UV.y);
Result.a=1.0;
}
void main()
{
float X_Q338;
float Y_Q338;
float Z_Q338;
float W_Q338;
X_Q338=vExtra2.x;
Y_Q338=vExtra2.y;
Z_Q338=vExtra2.z;
W_Q338=vExtra2.w;
vec4 Color_Q343;
#if IRIDESCENCE_ENABLE
Iridescence_B343(vPosition,vNormal,vUV,vBinormal,cameraPosition,_Iridescence_Tint_,_Iridescent_Map_,_Reflected_,_Frequency_,_Vertical_Offset_,Color_Q343);
#else
Color_Q343=vec4(0,0,0,0);
#endif
vec4 Result_Q344;
Scale_RGB_B344(_Iridescence_Intensity_,Color_Q343,Result_Q344);
vec4 Line_Color_Q362;
Line_Fragment_B362(_Line_Color_,_Highlight_Color_,_Highlight_Width_,vTangent,_Highlight_,Line_Color_Q362);
float Result_Q356;
#if EDGE_ONLY
Edge_B356(vExtra1,Z_Q338,W_Q338,vUV,_Edge_Width_,_Edge_Power_,Result_Q356);
#else
Result_Q356=1.0;
#endif
vec2 Vec2_Q339=vec2(X_Q338,Y_Q338);
vec4 Result_Q355;
Gradient_B355(_Gradient_Color_,_Top_Left_,_Top_Right_,_Bottom_Left_,_Bottom_Right_,Vec2_Q339,Result_Q355);
vec4 Linear_Q348;
Linear_Q348.rgb=clamp(Result_Q355.rgb*Result_Q355.rgb,0.0,1.0);
Linear_Q348.a=Result_Q355.a;
vec4 Result_Q346;
Scale_RGB_B346(Linear_Q348,Result_Q356,Result_Q346);
vec4 Sum_Q345=Result_Q346+Result_Q344;
vec4 Color_At_T_Q347=mix(Line_Color_Q362,Result_Q346,_Line_Gradient_Blend_);
vec4 Base_And_Iridescent_Q350;
Base_And_Iridescent_Q350=_Base_Color_+vec4(Sum_Q345.rgb,0.0);
vec4 Sum_Q349=Color_At_T_Q347+_Iridescence_Edge_Intensity_*Color_Q343;
vec4 Result_Q351=Sum_Q349; Result_Q351.a=1.0;
vec4 Color_Q332;
Round_Rect_Fragment_B332(Z_Q338,W_Q338,Result_Q351,_Filter_Width_,vUV,1.0,vExtra1,Base_And_Iridescent_Q350,Color_Q332);
vec4 Result_Q354=_Fade_Out_*Color_Q332;
vec4 sRGB_Q353;
FastLinearTosRGB_B353(Result_Q354,sRGB_Q353);
vec4 Out_Color=sRGB_Q353;
float Clip_Threshold=0.001;
bool To_sRGB=false;
gl_FragColor=Out_Color;
}`;st.ShadersStore[_s]=ls;const hs="mrdlBackplateVertexShader",cs=`uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec3 tangent;
uniform float _Radius_;
uniform float _Line_Width_;
uniform bool _Absolute_Sizes_;
uniform float _Filter_Width_;
uniform vec4 _Base_Color_;
uniform vec4 _Line_Color_;
uniform float _Radius_Top_Left_;
uniform float _Radius_Top_Right_;
uniform float _Radius_Bottom_Left_;
uniform float _Radius_Bottom_Right_;
uniform float _Rate_;
uniform vec4 _Highlight_Color_;
uniform float _Highlight_Width_;
uniform vec4 _Highlight_Transform_;
uniform float _Highlight_;
uniform float _Iridescence_Intensity_;
uniform float _Iridescence_Edge_Intensity_;
uniform vec4 _Iridescence_Tint_;
uniform sampler2D _Iridescent_Map_;
uniform float _Angle_;
uniform bool _Reflected_;
uniform float _Frequency_;
uniform float _Vertical_Offset_;
uniform vec4 _Gradient_Color_;
uniform vec4 _Top_Left_;
uniform vec4 _Top_Right_;
uniform vec4 _Bottom_Left_;
uniform vec4 _Bottom_Right_;
uniform float _Edge_Width_;
uniform float _Edge_Power_;
uniform float _Line_Gradient_Blend_;
uniform float _Fade_Out_;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec4 vExtra1;
varying vec4 vExtra2;
void Object_To_World_Pos_B314(
vec3 Pos_Object,
out vec3 Pos_World)
{
Pos_World=(world*vec4(Pos_Object,1.0)).xyz;
}
void Round_Rect_Vertex_B357(
vec2 UV,
float Radius,
float Margin,
float Anisotropy,
float Gradient1,
float Gradient2,
vec3 Normal,
vec4 Color_Scale_Translate,
out vec2 Rect_UV,
out vec4 Rect_Parms,
out vec2 Scale_XY,
out vec2 Line_UV,
out vec2 Color_UV_Info)
{
Scale_XY=vec2(Anisotropy,1.0);
Line_UV=(UV-vec2(0.5,0.5));
Rect_UV=Line_UV*Scale_XY;
Rect_Parms.xy=Scale_XY*0.5-vec2(Radius,Radius)-vec2(Margin,Margin);
Rect_Parms.z=Gradient1; 
Rect_Parms.w=Gradient2;
Color_UV_Info=(Line_UV+vec2(0.5,0.5))*Color_Scale_Translate.xy+Color_Scale_Translate.zw;
}
void Line_Vertex_B333(
vec2 Scale_XY,
vec2 UV,
float Time,
float Rate,
vec4 Highlight_Transform,
out vec3 Line_Vertex)
{
float angle2=(Rate*Time)*2.0*3.1416;
float sinAngle2=sin(angle2);
float cosAngle2=cos(angle2);
vec2 xformUV=UV*Highlight_Transform.xy+Highlight_Transform.zw;
Line_Vertex.x=0.0;
Line_Vertex.y=cosAngle2*xformUV.x-sinAngle2*xformUV.y;
Line_Vertex.z=0.0; 
}
void PickDir_B334(
float Degrees,
vec3 DirX,
vec3 DirY,
out vec3 Dir)
{
float a=Degrees*3.14159/180.0;
Dir=cos(a)*DirX+sin(a)*DirY;
}
void Move_Verts_B327(
float Anisotropy,
vec3 P,
float Radius,
out vec3 New_P,
out vec2 New_UV,
out float Radial_Gradient,
out vec3 Radial_Dir)
{
vec2 UV=P.xy*2.0+0.5;
vec2 center=clamp(UV,0.0,1.0);
vec2 delta=UV-center;
vec2 r2=2.0*vec2(Radius/Anisotropy,Radius);
New_UV=center+r2*(UV-2.0*center+0.5);
New_P=vec3(New_UV-0.5,P.z);
Radial_Gradient=1.0-length(delta)*2.0;
Radial_Dir=vec3(delta*r2,0.0);
}
void Pick_Radius_B336(
float Radius,
float Radius_Top_Left,
float Radius_Top_Right,
float Radius_Bottom_Left,
float Radius_Bottom_Right,
vec3 Position,
out float Result)
{
bool whichY=Position.y>0.0;
Result=Position.x<0.0 ? (whichY ? Radius_Top_Left : Radius_Bottom_Left) : (whichY ? Radius_Top_Right : Radius_Bottom_Right);
Result*=Radius;
}
void Edge_AA_Vertex_B328(
vec3 Position_World,
vec3 Position_Object,
vec3 Normal_Object,
vec3 Eye,
float Radial_Gradient,
vec3 Radial_Dir,
vec3 Tangent,
out float Gradient1,
out float Gradient2)
{
vec3 I=(Eye-Position_World);
vec3 T=(vec4(Tangent,0.0)).xyz;
float g=(dot(T,I)<0.0) ? 0.0 : 1.0;
if (Normal_Object.z==0.0) { 
Gradient1=Position_Object.z>0.0 ? g : 1.0;
Gradient2=Position_Object.z>0.0 ? 1.0 : g;
} else {
Gradient1=g+(1.0-g)*(Radial_Gradient);
Gradient2=1.0;
}
}
void Object_To_World_Dir_B330(
vec3 Dir_Object,
out vec3 Binormal_World,
out vec3 Binormal_World_N,
out float Binormal_Length)
{
Binormal_World=(world*vec4(Dir_Object,0.0)).xyz;
Binormal_Length=length(Binormal_World);
Binormal_World_N=Binormal_World/Binormal_Length;
}
void RelativeOrAbsoluteDetail_B341(
float Nominal_Radius,
float Nominal_LineWidth,
bool Absolute_Measurements,
float Height,
out float Radius,
out float Line_Width)
{
float scale=Absolute_Measurements ? 1.0/Height : 1.0;
Radius=Nominal_Radius*scale;
Line_Width=Nominal_LineWidth*scale;
}
void main()
{
vec3 Nrm_World_Q326;
Nrm_World_Q326=normalize((world*vec4(normal,0.0)).xyz);
vec3 Tangent_World_Q329;
vec3 Tangent_World_N_Q329;
float Tangent_Length_Q329;
Tangent_World_Q329=(world*vec4(vec3(1,0,0),0.0)).xyz;
Tangent_Length_Q329=length(Tangent_World_Q329);
Tangent_World_N_Q329=Tangent_World_Q329/Tangent_Length_Q329;
vec3 Binormal_World_Q330;
vec3 Binormal_World_N_Q330;
float Binormal_Length_Q330;
Object_To_World_Dir_B330(vec3(0,1,0),Binormal_World_Q330,Binormal_World_N_Q330,Binormal_Length_Q330);
float Radius_Q341;
float Line_Width_Q341;
RelativeOrAbsoluteDetail_B341(_Radius_,_Line_Width_,_Absolute_Sizes_,Binormal_Length_Q330,Radius_Q341,Line_Width_Q341);
vec3 Dir_Q334;
PickDir_B334(_Angle_,Tangent_World_N_Q329,Binormal_World_N_Q330,Dir_Q334);
float Result_Q336;
Pick_Radius_B336(Radius_Q341,_Radius_Top_Left_,_Radius_Top_Right_,_Radius_Bottom_Left_,_Radius_Bottom_Right_,position,Result_Q336);
float Anisotropy_Q331=Tangent_Length_Q329/Binormal_Length_Q330;
vec4 Out_Color_Q337=vec4(Result_Q336,Line_Width_Q341,0,1);
vec3 New_P_Q327;
vec2 New_UV_Q327;
float Radial_Gradient_Q327;
vec3 Radial_Dir_Q327;
Move_Verts_B327(Anisotropy_Q331,position,Result_Q336,New_P_Q327,New_UV_Q327,Radial_Gradient_Q327,Radial_Dir_Q327);
vec3 Pos_World_Q314;
Object_To_World_Pos_B314(New_P_Q327,Pos_World_Q314);
float Gradient1_Q328;
float Gradient2_Q328;
#if SMOOTH_EDGES
Edge_AA_Vertex_B328(Pos_World_Q314,position,normal,cameraPosition,Radial_Gradient_Q327,Radial_Dir_Q327,tangent,Gradient1_Q328,Gradient2_Q328);
#else
Gradient1_Q328=1.0;
Gradient2_Q328=1.0;
#endif
vec2 Rect_UV_Q357;
vec4 Rect_Parms_Q357;
vec2 Scale_XY_Q357;
vec2 Line_UV_Q357;
vec2 Color_UV_Info_Q357;
Round_Rect_Vertex_B357(New_UV_Q327,Result_Q336,0.0,Anisotropy_Q331,Gradient1_Q328,Gradient2_Q328,normal,vec4(1,1,0,0),Rect_UV_Q357,Rect_Parms_Q357,Scale_XY_Q357,Line_UV_Q357,Color_UV_Info_Q357);
vec3 Line_Vertex_Q333;
Line_Vertex_B333(Scale_XY_Q357,Line_UV_Q357,(20.0),_Rate_,_Highlight_Transform_,Line_Vertex_Q333);
float X_Q359;
float Y_Q359;
X_Q359=Color_UV_Info_Q357.x;
Y_Q359=Color_UV_Info_Q357.y;
vec4 Vec4_Q358=vec4(X_Q359,Y_Q359,Result_Q336,Line_Width_Q341);
vec3 Position=Pos_World_Q314;
vec3 Normal=Nrm_World_Q326;
vec2 UV=Rect_UV_Q357;
vec3 Tangent=Line_Vertex_Q333;
vec3 Binormal=Dir_Q334;
vec4 Color=Out_Color_Q337;
vec4 Extra1=Rect_Parms_Q357;
vec4 Extra2=Vec4_Q358;
vec4 Extra3=vec4(0,0,0,0);
gl_Position=viewProjection*vec4(Position,1);
vPosition=Position;
vNormal=Normal;
vUV=UV;
vTangent=Tangent;
vBinormal=Binormal;
vExtra1=Extra1;
vExtra2=Extra2;
}`;st.ShadersStore[hs]=cs;class ds extends Wt{constructor(){super(),this.IRIDESCENCE_ENABLE=!0,this.SMOOTH_EDGES=!0,this._needNormals=!0,this.rebuild()}}class A extends zt{constructor(t,e){super(t,e),this.radius=.3,this.lineWidth=.003,this.absoluteSizes=!1,this._filterWidth=1,this.baseColor=new M(0,0,0,1),this.lineColor=new M(.2,.262745,.4,1),this.radiusTopLeft=1,this.radiusTopRight=1,this.radiusBottomLeft=1,this.radiusBottomRight=1,this._rate=0,this.highlightColor=new M(.239216,.435294,.827451,1),this.highlightWidth=0,this._highlightTransform=new rt(1,1,0,0),this._highlight=1,this.iridescenceIntensity=.45,this.iridescenceEdgeIntensity=1,this.iridescenceTint=new M(1,1,1,1),this._angle=-45,this.fadeOut=1,this._reflected=!0,this._frequency=1,this._verticalOffset=0,this.gradientColor=new M(.74902,.74902,.74902,1),this.topLeftGradientColor=new M(.00784314,.294118,.580392,1),this.topRightGradientColor=new M(.305882,0,1,1),this.bottomLeftGradientColor=new M(.133333,.258824,.992157,1),this.bottomRightGradientColor=new M(.176471,.176471,.619608,1),this.edgeWidth=.5,this.edgePower=1,this.edgeLineGradientBlend=.5,this.alphaMode=Rt.ALPHA_DISABLE,this.backFaceCulling=!1,this._iridescentMapTexture=new O(A.IRIDESCENT_MAP_TEXTURE_URL,this.getScene(),!0,!1,O.NEAREST_SAMPLINGMODE)}needAlphaBlending(){return!1}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(t,e){if(this.isFrozen&&e.effect&&e.effect._wasPreviouslyReady)return!0;e.materialDefines||(e.materialDefines=new ds);const i=e.materialDefines,s=this.getScene();if(this._isReadyForSubMesh(e))return!0;const o=s.getEngine();if(L.PrepareDefinesForAttributes(t,i,!1,!1),i.isDirty){i.markAsProcessed(),s.resetCachedMaterial();const r=new qt;i.FOG&&r.addFallback(1,"FOG"),L.HandleFallbacksForShadows(i,r),i.IMAGEPROCESSINGPOSTPROCESS=s.imageProcessingConfiguration.applyByPostProcess;const a=[B.PositionKind];i.NORMAL&&a.push(B.NormalKind),i.UV1&&a.push(B.UVKind),i.UV2&&a.push(B.UV2Kind),i.VERTEXCOLOR&&a.push(B.ColorKind),i.TANGENT&&a.push(B.TangentKind),L.PrepareAttributesForInstances(a,i);const l="mrdlBackplate",h=i.toString(),f=["world","viewProjection","cameraPosition","_Radius_","_Line_Width_","_Absolute_Sizes_","_Filter_Width_","_Base_Color_","_Line_Color_","_Radius_Top_Left_","_Radius_Top_Right_","_Radius_Bottom_Left_","_Radius_Bottom_Right_","_Rate_","_Highlight_Color_","_Highlight_Width_","_Highlight_Transform_","_Highlight_","_Iridescence_Intensity_","_Iridescence_Edge_Intensity_","_Iridescence_Tint_","_Iridescent_Map_","_Angle_","_Reflected_","_Frequency_","_Vertical_Offset_","_Gradient_Color_","_Top_Left_","_Top_Right_","_Bottom_Left_","_Bottom_Right_","_Edge_Width_","_Edge_Power_","_Line_Gradient_Blend_","_Fade_Out_"],d=["_Iridescent_Map_"],u=new Array;L.PrepareUniformsAndSamplersList({uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:i,maxSimultaneousLights:4}),e.setEffect(s.getEngine().createEffect(l,{attributes:a,uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:h,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),i)}return!e.effect||!e.effect.isReady()?!1:(i._renderId=s.getRenderId(),e.effect._wasPreviouslyReady=!0,!0)}bindForSubMesh(t,e,i){if(!i.materialDefines)return;const o=i.effect;o&&(this._activeEffect=o,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("viewProjection",this.getScene().getTransformMatrix()),this._activeEffect.setVector3("cameraPosition",this.getScene().activeCamera.position),this._activeEffect.setFloat("_Radius_",this.radius),this._activeEffect.setFloat("_Line_Width_",this.lineWidth),this._activeEffect.setFloat("_Absolute_Sizes_",this.absoluteSizes?1:0),this._activeEffect.setFloat("_Filter_Width_",this._filterWidth),this._activeEffect.setDirectColor4("_Base_Color_",this.baseColor),this._activeEffect.setDirectColor4("_Line_Color_",this.lineColor),this._activeEffect.setFloat("_Radius_Top_Left_",this.radiusTopLeft),this._activeEffect.setFloat("_Radius_Top_Right_",this.radiusTopRight),this._activeEffect.setFloat("_Radius_Bottom_Left_",this.radiusBottomLeft),this._activeEffect.setFloat("_Radius_Bottom_Right_",this.radiusBottomRight),this._activeEffect.setFloat("_Rate_",this._rate),this._activeEffect.setDirectColor4("_Highlight_Color_",this.highlightColor),this._activeEffect.setFloat("_Highlight_Width_",this.highlightWidth),this._activeEffect.setVector4("_Highlight_Transform_",this._highlightTransform),this._activeEffect.setFloat("_Highlight_",this._highlight),this._activeEffect.setFloat("_Iridescence_Intensity_",this.iridescenceIntensity),this._activeEffect.setFloat("_Iridescence_Edge_Intensity_",this.iridescenceEdgeIntensity),this._activeEffect.setDirectColor4("_Iridescence_Tint_",this.iridescenceTint),this._activeEffect.setTexture("_Iridescent_Map_",this._iridescentMapTexture),this._activeEffect.setFloat("_Angle_",this._angle),this._activeEffect.setFloat("_Reflected_",this._reflected?1:0),this._activeEffect.setFloat("_Frequency_",this._frequency),this._activeEffect.setFloat("_Vertical_Offset_",this._verticalOffset),this._activeEffect.setDirectColor4("_Gradient_Color_",this.gradientColor),this._activeEffect.setDirectColor4("_Top_Left_",this.topLeftGradientColor),this._activeEffect.setDirectColor4("_Top_Right_",this.topRightGradientColor),this._activeEffect.setDirectColor4("_Bottom_Left_",this.bottomLeftGradientColor),this._activeEffect.setDirectColor4("_Bottom_Right_",this.bottomRightGradientColor),this._activeEffect.setFloat("_Edge_Width_",this.edgeWidth),this._activeEffect.setFloat("_Edge_Power_",this.edgePower),this._activeEffect.setFloat("_Line_Gradient_Blend_",this.edgeLineGradientBlend),this._activeEffect.setFloat("_Fade_Out_",this.fadeOut),this._afterBind(e,this._activeEffect))}getAnimatables(){return[]}dispose(t){super.dispose(t)}clone(t){return H.Clone(()=>new A(t,this.getScene()),this)}serialize(){const t=super.serialize();return t.customType="BABYLON.MRDLBackplateMaterial",t}getClassName(){return"MRDLBackplateMaterial"}static Parse(t,e,i){return H.Parse(()=>new A(t.name,e),t,e,i)}}A.IRIDESCENT_MAP_TEXTURE_URL="https://assets.babylonjs.com/meshes/MRTK/MRDL/mrtk-mrdl-backplate-iridescence.png";n([_()],A.prototype,"radius",void 0);n([_()],A.prototype,"lineWidth",void 0);n([_()],A.prototype,"absoluteSizes",void 0);n([_()],A.prototype,"baseColor",void 0);n([_()],A.prototype,"lineColor",void 0);n([_()],A.prototype,"radiusTopLeft",void 0);n([_()],A.prototype,"radiusTopRight",void 0);n([_()],A.prototype,"radiusBottomLeft",void 0);n([_()],A.prototype,"radiusBottomRight",void 0);n([_()],A.prototype,"highlightColor",void 0);n([_()],A.prototype,"highlightWidth",void 0);n([_()],A.prototype,"iridescenceIntensity",void 0);n([_()],A.prototype,"iridescenceEdgeIntensity",void 0);n([_()],A.prototype,"iridescenceTint",void 0);n([_()],A.prototype,"fadeOut",void 0);n([_()],A.prototype,"gradientColor",void 0);n([_()],A.prototype,"topLeftGradientColor",void 0);n([_()],A.prototype,"topRightGradientColor",void 0);n([_()],A.prototype,"bottomLeftGradientColor",void 0);n([_()],A.prototype,"bottomRightGradientColor",void 0);n([_()],A.prototype,"edgeWidth",void 0);n([_()],A.prototype,"edgePower",void 0);n([_()],A.prototype,"edgeLineGradientBlend",void 0);F("BABYLON.GUI.MRDLBackplateMaterial",A);const fs="mrdlBackglowPixelShader",us=`uniform vec3 cameraPosition;
varying vec3 vNormal;
varying vec2 vUV;
uniform float _Bevel_Radius_;
uniform float _Line_Width_;
uniform bool _Absolute_Sizes_;
uniform float _Tuning_Motion_;
uniform float _Motion_;
uniform float _Max_Intensity_;
uniform float _Intensity_Fade_In_Exponent_;
uniform float _Outer_Fuzz_Start_;
uniform float _Outer_Fuzz_End_;
uniform vec4 _Color_;
uniform vec4 _Inner_Color_;
uniform float _Blend_Exponent_;
uniform float _Falloff_;
uniform float _Bias_;
float BiasFunc(float b,float v) {
return pow(v,log(clamp(b,0.001,0.999))/log(0.5));
}
void Fuzzy_Round_Rect_B33(
float Size_X,
float Size_Y,
float Radius_X,
float Radius_Y,
float Line_Width,
vec2 UV,
float Outer_Fuzz,
float Max_Outer_Fuzz,
out float Rect_Distance,
out float Inner_Distance)
{
vec2 halfSize=vec2(Size_X,Size_Y)*0.5;
vec2 r=max(min(vec2(Radius_X,Radius_Y),halfSize),vec2(0.001,0.001));
float radius=min(r.x,r.y)-Max_Outer_Fuzz;
vec2 v=abs(UV);
vec2 nearestp=min(v,halfSize-r);
float d=distance(nearestp,v);
Inner_Distance=clamp(1.0-(radius-d)/Line_Width,0.0,1.0);
Rect_Distance=clamp(1.0-(d-radius)/Outer_Fuzz,0.0,1.0)*Inner_Distance;
}
void main()
{
float X_Q42;
float Y_Q42;
X_Q42=vNormal.x;
Y_Q42=vNormal.y;
float MaxAB_Q24=max(_Tuning_Motion_,_Motion_);
float Sqrt_F_Q27=sqrt(MaxAB_Q24);
float Power_Q43=pow(MaxAB_Q24,_Intensity_Fade_In_Exponent_);
float Value_At_T_Q26=mix(_Outer_Fuzz_Start_,_Outer_Fuzz_End_,Sqrt_F_Q27);
float Product_Q23=_Max_Intensity_*Power_Q43;
float Rect_Distance_Q33;
float Inner_Distance_Q33;
Fuzzy_Round_Rect_B33(X_Q42,Y_Q42,_Bevel_Radius_,_Bevel_Radius_,_Line_Width_,vUV,Value_At_T_Q26,_Outer_Fuzz_Start_,Rect_Distance_Q33,Inner_Distance_Q33);
float Power_Q44=pow(Inner_Distance_Q33,_Blend_Exponent_);
float Result_Q45=pow(BiasFunc(_Bias_,Rect_Distance_Q33),_Falloff_);
vec4 Color_At_T_Q25=mix(_Inner_Color_,_Color_,Power_Q44);
float Product_Q22=Result_Q45*Product_Q23;
vec4 Result_Q28=Product_Q22*Color_At_T_Q25;
vec4 Out_Color=Result_Q28;
float Clip_Threshold=0.0;
gl_FragColor=Out_Color;
}`;st.ShadersStore[fs]=us;const gs="mrdlBackglowVertexShader",ms=`uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 tangent;
uniform float _Bevel_Radius_;
uniform float _Line_Width_;
uniform bool _Absolute_Sizes_;
uniform float _Tuning_Motion_;
uniform float _Motion_;
uniform float _Max_Intensity_;
uniform float _Intensity_Fade_In_Exponent_;
uniform float _Outer_Fuzz_Start_;
uniform float _Outer_Fuzz_End_;
uniform vec4 _Color_;
uniform vec4 _Inner_Color_;
uniform float _Blend_Exponent_;
uniform float _Falloff_;
uniform float _Bias_;
varying vec3 vNormal;
varying vec2 vUV;
void main()
{
vec3 Dir_World_Q41=(world*vec4(tangent,0.0)).xyz;
vec3 Dir_World_Q40=(world*vec4((cross(normal,tangent)),0.0)).xyz;
float MaxAB_Q24=max(_Tuning_Motion_,_Motion_);
float Length_Q16=length(Dir_World_Q41);
float Length_Q17=length(Dir_World_Q40);
bool Greater_Than_Q37=MaxAB_Q24>0.0;
vec3 Sizes_Q35;
vec2 XY_Q35;
Sizes_Q35=(_Absolute_Sizes_ ? vec3(Length_Q16,Length_Q17,0) : vec3(Length_Q16/Length_Q17,1,0));
XY_Q35=(uv-vec2(0.5,0.5))*Sizes_Q35.xy;
vec3 Result_Q38=Greater_Than_Q37 ? position : vec3(0,0,0);
vec3 Pos_World_Q39=(world*vec4(Result_Q38,1.0)).xyz;
vec3 Position=Pos_World_Q39;
vec3 Normal=Sizes_Q35;
vec2 UV=XY_Q35;
vec3 Tangent=vec3(0,0,0);
vec3 Binormal=vec3(0,0,0);
vec4 Color=vec4(1,1,1,1);
gl_Position=viewProjection*vec4(Position,1);
vNormal=Normal;
vUV=UV;
}`;st.ShadersStore[gs]=ms;class bs extends Wt{constructor(){super(),this._needNormals=!0,this._needUVs=!0,this.rebuild()}}class nt extends zt{constructor(t,e){super(t,e),this.bevelRadius=.16,this.lineWidth=.16,this.absoluteSizes=!1,this.tuningMotion=0,this.motion=1,this.maxIntensity=.7,this.intensityFadeInExponent=2,this.outerFuzzStart=.04,this.outerFuzzEnd=.04,this.color=new M(.682353,.698039,1,1),this.innerColor=new M(.356863,.392157,.796078,1),this.blendExponent=1.5,this.falloff=2,this.bias=.5,this.alphaMode=Rt.ALPHA_ADD,this.disableDepthWrite=!0,this.backFaceCulling=!1}needAlphaBlending(){return!0}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(t,e){if(this.isFrozen&&e.effect&&e.effect._wasPreviouslyReady)return!0;e.materialDefines||(e.materialDefines=new bs);const i=e.materialDefines,s=this.getScene();if(this._isReadyForSubMesh(e))return!0;const o=s.getEngine();if(L.PrepareDefinesForAttributes(t,i,!1,!1),i.isDirty){i.markAsProcessed(),s.resetCachedMaterial();const r=new qt;i.FOG&&r.addFallback(1,"FOG"),L.HandleFallbacksForShadows(i,r),i.IMAGEPROCESSINGPOSTPROCESS=s.imageProcessingConfiguration.applyByPostProcess;const a=[B.PositionKind];i.NORMAL&&a.push(B.NormalKind),i.UV1&&a.push(B.UVKind),i.UV2&&a.push(B.UV2Kind),i.VERTEXCOLOR&&a.push(B.ColorKind),i.TANGENT&&a.push(B.TangentKind),L.PrepareAttributesForInstances(a,i);const l="mrdlBackglow",h=i.toString(),f=["world","worldView","worldViewProjection","view","projection","viewProjection","cameraPosition","_Bevel_Radius_","_Line_Width_","_Absolute_Sizes_","_Tuning_Motion_","_Motion_","_Max_Intensity_","_Intensity_Fade_In_Exponent_","_Outer_Fuzz_Start_","_Outer_Fuzz_End_","_Color_","_Inner_Color_","_Blend_Exponent_","_Falloff_","_Bias_"],d=[],u=new Array;L.PrepareUniformsAndSamplersList({uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:i,maxSimultaneousLights:4}),e.setEffect(s.getEngine().createEffect(l,{attributes:a,uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:h,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),i)}return!e.effect||!e.effect.isReady()?!1:(i._renderId=s.getRenderId(),e.effect._wasPreviouslyReady=!0,!0)}bindForSubMesh(t,e,i){const s=this.getScene();if(!i.materialDefines)return;const r=i.effect;r&&(this._activeEffect=r,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("viewProjection",s.getTransformMatrix()),this._activeEffect.setVector3("cameraPosition",s.activeCamera.position),this._activeEffect.setFloat("_Bevel_Radius_",this.bevelRadius),this._activeEffect.setFloat("_Line_Width_",this.lineWidth),this._activeEffect.setFloat("_Absolute_Sizes_",this.absoluteSizes?1:0),this._activeEffect.setFloat("_Tuning_Motion_",this.tuningMotion),this._activeEffect.setFloat("_Motion_",this.motion),this._activeEffect.setFloat("_Max_Intensity_",this.maxIntensity),this._activeEffect.setFloat("_Intensity_Fade_In_Exponent_",this.intensityFadeInExponent),this._activeEffect.setFloat("_Outer_Fuzz_Start_",this.outerFuzzStart),this._activeEffect.setFloat("_Outer_Fuzz_End_",this.outerFuzzEnd),this._activeEffect.setDirectColor4("_Color_",this.color),this._activeEffect.setDirectColor4("_Inner_Color_",this.innerColor),this._activeEffect.setFloat("_Blend_Exponent_",this.blendExponent),this._activeEffect.setFloat("_Falloff_",this.falloff),this._activeEffect.setFloat("_Bias_",this.bias),this._afterBind(e,this._activeEffect))}getAnimatables(){return[]}dispose(t){super.dispose(t)}clone(t){return H.Clone(()=>new nt(t,this.getScene()),this)}serialize(){const t=H.Serialize(this);return t.customType="BABYLON.MRDLBackglowMaterial",t}getClassName(){return"MRDLBackglowMaterial"}static Parse(t,e,i){return H.Parse(()=>new nt(t.name,e),t,e,i)}}n([_()],nt.prototype,"bevelRadius",void 0);n([_()],nt.prototype,"lineWidth",void 0);n([_()],nt.prototype,"absoluteSizes",void 0);n([_()],nt.prototype,"tuningMotion",void 0);n([_()],nt.prototype,"motion",void 0);n([_()],nt.prototype,"maxIntensity",void 0);n([_()],nt.prototype,"intensityFadeInExponent",void 0);n([_()],nt.prototype,"outerFuzzStart",void 0);n([_()],nt.prototype,"outerFuzzEnd",void 0);n([_()],nt.prototype,"color",void 0);n([_()],nt.prototype,"innerColor",void 0);n([_()],nt.prototype,"blendExponent",void 0);n([_()],nt.prototype,"falloff",void 0);n([_()],nt.prototype,"bias",void 0);F("BABYLON.GUI.MRDLBackglowMaterial",nt);const vs="mrdlFrontplatePixelShader",ps=`uniform vec3 cameraPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec4 vExtra1;
varying vec4 vExtra2;
varying vec4 vExtra3;
uniform float _Radius_;
uniform float _Line_Width_;
uniform bool _Relative_To_Height_;
uniform float _Filter_Width_;
uniform vec4 _Edge_Color_;
uniform float _Fade_Out_;
uniform bool _Smooth_Edges_;
uniform bool _Blob_Enable_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Inner_Fade_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform float _Blob_Pulse_Max_Size_;
uniform bool _Blob_Enable_2_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Inner_Fade_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform float _Gaze_Intensity_;
uniform float _Gaze_Focus_;
uniform sampler2D _Blob_Texture_;
uniform float _Selection_Fuzz_;
uniform float _Selected_;
uniform float _Selection_Fade_;
uniform float _Selection_Fade_Size_;
uniform float _Selected_Distance_;
uniform float _Selected_Fade_Length_;
uniform float _Proximity_Max_Intensity_;
uniform float _Proximity_Far_Distance_;
uniform float _Proximity_Near_Radius_;
uniform float _Proximity_Anisotropy_;
uniform bool _Use_Global_Left_Index_;
uniform bool _Use_Global_Right_Index_;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
void Scale_Color_B54(
vec4 Color,
float Scalar,
out vec4 Result)
{
Result=Scalar*Color;
}
void Scale_RGB_B50(
vec4 Color,
float Scalar,
out vec4 Result)
{
Result=vec4(Scalar,Scalar,Scalar,1)*Color;
}
void Proximity_Fragment_B51(
float Proximity_Max_Intensity,
float Proximity_Near_Radius,
vec4 Deltas,
float Show_Selection,
float Distance_Fade1,
float Distance_Fade2,
float Strength,
out float Proximity)
{
float proximity1=(1.0-clamp(length(Deltas.xy)/Proximity_Near_Radius,0.0,1.0))*Distance_Fade1;
float proximity2=(1.0-clamp(length(Deltas.zw)/Proximity_Near_Radius,0.0,1.0))*Distance_Fade2;
Proximity=Strength*(Proximity_Max_Intensity*max(proximity1,proximity2) *(1.0-Show_Selection)+Show_Selection);
}
void Blob_Fragment_B56(
vec2 UV,
vec3 Blob_Info,
sampler2D Blob_Texture,
out vec4 Blob_Color)
{
float k=dot(UV,UV);
Blob_Color=Blob_Info.y*texture(Blob_Texture,vec2(vec2(sqrt(k),Blob_Info.x).x,1.0-vec2(sqrt(k),Blob_Info.x).y))*(1.0-clamp(k,0.0,1.0));
}
void Round_Rect_Fragment_B61(
float Radius,
vec4 Line_Color,
float Filter_Width,
float Line_Visibility,
vec4 Fill_Color,
bool Smooth_Edges,
vec4 Rect_Parms,
out float Inside_Rect)
{
float d=length(max(abs(Rect_Parms.zw)-Rect_Parms.xy,0.0));
float dx=max(fwidth(d)*Filter_Width,0.00001);
Inside_Rect=Smooth_Edges ? clamp((Radius-d)/dx,0.0,1.0) : 1.0-step(Radius,d);
}
void main()
{
float Is_Quad_Q53;
Is_Quad_Q53=vNormal.z;
vec4 Blob_Color_Q56;
Blob_Fragment_B56(vUV,vTangent,_Blob_Texture_,Blob_Color_Q56);
float X_Q52;
float Y_Q52;
float Z_Q52;
float W_Q52;
X_Q52=vExtra3.x;
Y_Q52=vExtra3.y;
Z_Q52=vExtra3.z;
W_Q52=vExtra3.w;
float Proximity_Q51;
Proximity_Fragment_B51(_Proximity_Max_Intensity_,_Proximity_Near_Radius_,vExtra2,X_Q52,Y_Q52,Z_Q52,1.0,Proximity_Q51);
float Inside_Rect_Q61;
Round_Rect_Fragment_B61(W_Q52,vec4(1,1,1,1),_Filter_Width_,1.0,vec4(0,0,0,0),_Smooth_Edges_,vExtra1,Inside_Rect_Q61);
vec4 Result_Q50;
Scale_RGB_B50(_Edge_Color_,Proximity_Q51,Result_Q50);
vec4 Result_Q47=Inside_Rect_Q61*Blob_Color_Q56;
vec4 Color_At_T_Q48=mix(Result_Q50,Result_Q47,Is_Quad_Q53);
vec4 Result_Q54;
Scale_Color_B54(Color_At_T_Q48,_Fade_Out_,Result_Q54);
vec4 Out_Color=Result_Q54;
float Clip_Threshold=0.001;
bool To_sRGB=false;
gl_FragColor=Out_Color;
}`;st.ShadersStore[vs]=ps;const xs="mrdlFrontplateVertexShader",Is=`uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 tangent;
attribute vec4 color;
uniform float _Radius_;
uniform float _Line_Width_;
uniform bool _Relative_To_Height_;
uniform float _Filter_Width_;
uniform vec4 _Edge_Color_;
uniform float _Fade_Out_;
uniform bool _Smooth_Edges_;
uniform bool _Blob_Enable_;
uniform vec3 _Blob_Position_;
uniform float _Blob_Intensity_;
uniform float _Blob_Near_Size_;
uniform float _Blob_Far_Size_;
uniform float _Blob_Near_Distance_;
uniform float _Blob_Far_Distance_;
uniform float _Blob_Fade_Length_;
uniform float _Blob_Inner_Fade_;
uniform float _Blob_Pulse_;
uniform float _Blob_Fade_;
uniform float _Blob_Pulse_Max_Size_;
uniform bool _Blob_Enable_2_;
uniform vec3 _Blob_Position_2_;
uniform float _Blob_Near_Size_2_;
uniform float _Blob_Inner_Fade_2_;
uniform float _Blob_Pulse_2_;
uniform float _Blob_Fade_2_;
uniform float _Gaze_Intensity_;
uniform float _Gaze_Focus_;
uniform sampler2D _Blob_Texture_;
uniform float _Selection_Fuzz_;
uniform float _Selected_;
uniform float _Selection_Fade_;
uniform float _Selection_Fade_Size_;
uniform float _Selected_Distance_;
uniform float _Selected_Fade_Length_;
uniform float _Proximity_Max_Intensity_;
uniform float _Proximity_Far_Distance_;
uniform float _Proximity_Near_Radius_;
uniform float _Proximity_Anisotropy_;
uniform bool _Use_Global_Left_Index_;
uniform bool _Use_Global_Right_Index_;
uniform vec4 Global_Left_Index_Tip_Position;
uniform vec4 Global_Right_Index_Tip_Position;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vTangent;
varying vec4 vExtra1;
varying vec4 vExtra2;
varying vec4 vExtra3;
void Blob_Vertex_B40(
vec3 Position,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
vec3 Blob_Position,
float Intensity,
float Blob_Near_Size,
float Blob_Far_Size,
float Blob_Near_Distance,
float Blob_Far_Distance,
vec4 Vx_Color,
vec2 UV,
vec3 Face_Center,
vec2 Face_Size,
vec2 In_UV,
float Blob_Fade_Length,
float Selection_Fade,
float Selection_Fade_Size,
float Inner_Fade,
float Blob_Pulse,
float Blob_Fade,
float Blob_Enabled,
float DistanceOffset,
out vec3 Out_Position,
out vec2 Out_UV,
out vec3 Blob_Info,
out vec2 Blob_Relative_UV)
{
float blobSize,fadeIn;
vec3 Hit_Position;
Blob_Info=vec3(0.0,0.0,0.0);
float Hit_Distance=dot(Blob_Position-Face_Center,Normal)+DistanceOffset*Blob_Far_Distance;
Hit_Position=Blob_Position-Hit_Distance*Normal;
float absD=abs(Hit_Distance);
float lerpVal=clamp((absD-Blob_Near_Distance)/(Blob_Far_Distance-Blob_Near_Distance),0.0,1.0);
fadeIn=1.0-clamp((absD-Blob_Far_Distance)/Blob_Fade_Length,0.0,1.0);
float innerFade=1.0-clamp(-Hit_Distance/Inner_Fade,0.0,1.0);
float farClip=clamp(1.0-step(Blob_Far_Distance+Blob_Fade_Length,absD),0.0,1.0);
float size=mix(Blob_Near_Size,Blob_Far_Size,lerpVal)*farClip;
blobSize=mix(size,Selection_Fade_Size,Selection_Fade)*innerFade*Blob_Enabled;
Blob_Info.x=lerpVal*0.5+0.5;
Blob_Info.y=fadeIn*Intensity*(1.0-Selection_Fade)*Blob_Fade;
Blob_Info.x*=(1.0-Blob_Pulse);
vec3 delta=Hit_Position-Face_Center;
vec2 blobCenterXY=vec2(dot(delta,Tangent),dot(delta,Bitangent));
vec2 quadUVin=2.0*UV-1.0; 
vec2 blobXY=blobCenterXY+quadUVin*blobSize;
vec2 blobClipped=clamp(blobXY,-Face_Size*0.5,Face_Size*0.5);
vec2 blobUV=(blobClipped-blobCenterXY)/max(blobSize,0.0001)*2.0;
vec3 blobCorner=Face_Center+blobClipped.x*Tangent+blobClipped.y*Bitangent;
Out_Position=mix(Position,blobCorner,Vx_Color.rrr);
Out_UV=mix(In_UV,blobUV,Vx_Color.rr);
Blob_Relative_UV=blobClipped/Face_Size.y;
}
void Round_Rect_Vertex_B36(
vec2 UV,
vec3 Tangent,
vec3 Binormal,
float Radius,
float Anisotropy,
vec2 Blob_Center_UV,
out vec2 Rect_UV,
out vec2 Scale_XY,
out vec4 Rect_Parms)
{
Scale_XY=vec2(Anisotropy,1.0);
Rect_UV=(UV-vec2(0.5,0.5))*Scale_XY;
Rect_Parms.xy=Scale_XY*0.5-vec2(Radius,Radius);
Rect_Parms.zw=Blob_Center_UV;
}
vec2 ProjectProximity(
vec3 blobPosition,
vec3 position,
vec3 center,
vec3 dir,
vec3 xdir,
vec3 ydir,
out float vdistance
)
{
vec3 delta=blobPosition-position;
vec2 xy=vec2(dot(delta,xdir),dot(delta,ydir));
vdistance=abs(dot(delta,dir));
return xy;
}
void Proximity_Vertex_B33(
vec3 Blob_Position,
vec3 Blob_Position_2,
vec3 Face_Center,
vec3 Position,
float Proximity_Far_Distance,
float Relative_Scale,
float Proximity_Anisotropy,
vec3 Normal,
vec3 Tangent,
vec3 Binormal,
out vec4 Extra,
out float Distance_To_Face,
out float Distance_Fade1,
out float Distance_Fade2)
{
float distz1,distz2;
Extra.xy=ProjectProximity(Blob_Position,Position,Face_Center,Normal,Tangent*Proximity_Anisotropy,Binormal,distz1)/Relative_Scale;
Extra.zw=ProjectProximity(Blob_Position_2,Position,Face_Center,Normal,Tangent*Proximity_Anisotropy,Binormal,distz2)/Relative_Scale;
Distance_To_Face=dot(Normal,Position-Face_Center);
Distance_Fade1=1.0-clamp(distz1/Proximity_Far_Distance,0.0,1.0);
Distance_Fade2=1.0-clamp(distz2/Proximity_Far_Distance,0.0,1.0);
}
void Object_To_World_Pos_B12(
vec3 Pos_Object,
out vec3 Pos_World)
{
Pos_World=(world*vec4(Pos_Object,1.0)).xyz;
}
void Choose_Blob_B27(
vec4 Vx_Color,
vec3 Position1,
vec3 Position2,
bool Blob_Enable_1,
bool Blob_Enable_2,
float Near_Size_1,
float Near_Size_2,
float Blob_Inner_Fade_1,
float Blob_Inner_Fade_2,
float Blob_Pulse_1,
float Blob_Pulse_2,
float Blob_Fade_1,
float Blob_Fade_2,
out vec3 Position,
out float Near_Size,
out float Inner_Fade,
out float Blob_Enable,
out float Fade,
out float Pulse)
{
Position=Position1*(1.0-Vx_Color.g)+Vx_Color.g*Position2;
float b1=Blob_Enable_1 ? 1.0 : 0.0;
float b2=Blob_Enable_2 ? 1.0 : 0.0;
Blob_Enable=b1+(b2-b1)*Vx_Color.g;
Pulse=Blob_Pulse_1*(1.0-Vx_Color.g)+Vx_Color.g*Blob_Pulse_2;
Fade=Blob_Fade_1*(1.0-Vx_Color.g)+Vx_Color.g*Blob_Fade_2;
Near_Size=Near_Size_1*(1.0-Vx_Color.g)+Vx_Color.g*Near_Size_2;
Inner_Fade=Blob_Inner_Fade_1*(1.0-Vx_Color.g)+Vx_Color.g*Blob_Inner_Fade_2;
}
void Move_Verts_B32(
vec2 UV,
float Radius,
float Anisotropy,
float Line_Width,
float Visible,
out vec3 New_P,
out vec2 New_UV)
{
vec2 xy=2.0*UV-vec2(0.5,0.5);
vec2 center=clamp(xy,0.0,1.0);
vec2 delta=2.0*(xy-center);
float deltaLength=length(delta);
vec2 aniso=vec2(1.0/Anisotropy,1.0);
center=(center-vec2(0.5,0.5))*(1.0-2.0*Radius*aniso);
New_UV=vec2((2.0-2.0*deltaLength)*Visible,0.0);
float deltaRadius= (Radius-Line_Width*New_UV.x);
New_P.xy=(center+deltaRadius/deltaLength *aniso*delta);
New_P.z=0.0;
}
void Object_To_World_Dir_B14(
vec3 Dir_Object,
out vec3 Binormal_World)
{
Binormal_World=(world*vec4(Dir_Object,0.0)).xyz;
}
void Proximity_Visibility_B55(
float Selection,
vec3 Proximity_Center,
vec3 Proximity_Center_2,
float Proximity_Far_Distance,
float Proximity_Radius,
vec3 Face_Center,
vec3 Normal,
vec2 Face_Size,
float Gaze,
out float Width)
{
float boxMaxSize=length(Face_Size)*0.5;
float d1=dot(Proximity_Center-Face_Center,Normal);
vec3 blob1=Proximity_Center-d1*Normal;
float d2=dot(Proximity_Center_2-Face_Center,Normal);
vec3 blob2=Proximity_Center_2-d2*Normal;
vec3 delta1=blob1-Face_Center;
vec3 delta2=blob2-Face_Center;
float dist1=dot(delta1,delta1);
float dist2=dot(delta2,delta2);
float nearestProxDist=sqrt(min(dist1,dist2));
Width=(1.0-step(boxMaxSize+Proximity_Radius,nearestProxDist))*(1.0-step(Proximity_Far_Distance,min(d1,d2))*(1.0-step(0.0001,Selection)));
Width=max(Gaze,Width);
}
vec2 ramp2(vec2 start,vec2 end,vec2 x)
{
return clamp((x-start)/(end-start),vec2(0.0,0.0),vec2(1.0,1.0));
}
float computeSelection(
vec3 blobPosition,
vec3 normal,
vec3 tangent,
vec3 bitangent,
vec3 faceCenter,
vec2 faceSize,
float selectionFuzz,
float farDistance,
float fadeLength
)
{
vec3 delta=blobPosition-faceCenter;
float absD=abs(dot(delta,normal));
float fadeIn=1.0-clamp((absD-farDistance)/fadeLength,0.0,1.0);
vec2 blobCenterXY=vec2(dot(delta,tangent),dot(delta,bitangent));
vec2 innerFace=faceSize*(1.0-selectionFuzz)*0.5;
vec2 selectPulse=ramp2(-faceSize*0.5,-innerFace,blobCenterXY)-ramp2(innerFace,faceSize*0.5,blobCenterXY);
return selectPulse.x*selectPulse.y*fadeIn;
}
void Selection_Vertex_B31(
vec3 Blob_Position,
vec3 Blob_Position_2,
vec3 Face_Center,
vec2 Face_Size,
vec3 Normal,
vec3 Tangent,
vec3 Bitangent,
float Selection_Fuzz,
float Selected,
float Far_Distance,
float Fade_Length,
vec3 Active_Face_Dir,
out float Show_Selection)
{
float select1=computeSelection(Blob_Position,Normal,Tangent,Bitangent,Face_Center,Face_Size,Selection_Fuzz,Far_Distance,Fade_Length);
float select2=computeSelection(Blob_Position_2,Normal,Tangent,Bitangent,Face_Center,Face_Size,Selection_Fuzz,Far_Distance,Fade_Length);
Show_Selection=mix(max(select1,select2),1.0,Selected);
}
void main()
{
vec3 Vec3_Q29=vec3(vec2(0,0).x,vec2(0,0).y,color.r);
vec3 Nrm_World_Q24;
Nrm_World_Q24=normalize((world*vec4(normal,0.0)).xyz);
vec3 Face_Center_Q30;
Face_Center_Q30=(world*vec4(vec3(0,0,0),1.0)).xyz;
vec3 Tangent_World_Q13;
Tangent_World_Q13=(world*vec4(tangent,0.0)).xyz;
vec3 Result_Q42;
Result_Q42=_Use_Global_Left_Index_ ? Global_Left_Index_Tip_Position.xyz : _Blob_Position_;
vec3 Result_Q43;
Result_Q43=_Use_Global_Right_Index_ ? Global_Right_Index_Tip_Position.xyz : _Blob_Position_2_;
float Value_At_T_Q58=mix(_Blob_Near_Size_,_Blob_Pulse_Max_Size_,_Blob_Pulse_);
float Value_At_T_Q59=mix(_Blob_Near_Size_2_,_Blob_Pulse_Max_Size_,_Blob_Pulse_2_);
vec3 Cross_Q70=cross(normal,tangent);
float Product_Q45=_Gaze_Intensity_*_Gaze_Focus_;
float Step_Q46=step(0.0001,Product_Q45);
vec3 Tangent_World_N_Q15=normalize(Tangent_World_Q13);
vec3 Position_Q27;
float Near_Size_Q27;
float Inner_Fade_Q27;
float Blob_Enable_Q27;
float Fade_Q27;
float Pulse_Q27;
Choose_Blob_B27(color,Result_Q42,Result_Q43,_Blob_Enable_,_Blob_Enable_2_,Value_At_T_Q58,Value_At_T_Q59,_Blob_Inner_Fade_,_Blob_Inner_Fade_2_,_Blob_Pulse_,_Blob_Pulse_2_,_Blob_Fade_,_Blob_Fade_2_,Position_Q27,Near_Size_Q27,Inner_Fade_Q27,Blob_Enable_Q27,Fade_Q27,Pulse_Q27);
vec3 Binormal_World_Q14;
Object_To_World_Dir_B14(Cross_Q70,Binormal_World_Q14);
float Anisotropy_Q21=length(Tangent_World_Q13)/length(Binormal_World_Q14);
vec3 Binormal_World_N_Q16=normalize(Binormal_World_Q14);
vec2 Face_Size_Q35;
float ScaleY_Q35;
Face_Size_Q35=vec2(length(Tangent_World_Q13),length(Binormal_World_Q14));
ScaleY_Q35=Face_Size_Q35.y;
float Out_Radius_Q38;
float Out_Line_Width_Q38;
Out_Radius_Q38=_Relative_To_Height_ ? _Radius_ : _Radius_/ScaleY_Q35;
Out_Line_Width_Q38=_Relative_To_Height_ ? _Line_Width_ : _Line_Width_/ScaleY_Q35;
float Show_Selection_Q31;
Selection_Vertex_B31(Result_Q42,Result_Q43,Face_Center_Q30,Face_Size_Q35,Nrm_World_Q24,Tangent_World_N_Q15,Binormal_World_N_Q16,_Selection_Fuzz_,_Selected_,_Selected_Distance_,_Selected_Fade_Length_,vec3(0,0,-1),Show_Selection_Q31);
float MaxAB_Q41=max(Show_Selection_Q31,Product_Q45);
float Width_Q55;
Proximity_Visibility_B55(Show_Selection_Q31,Result_Q42,Result_Q43,_Proximity_Far_Distance_,_Proximity_Near_Radius_,Face_Center_Q30,Nrm_World_Q24,Face_Size_Q35,Step_Q46,Width_Q55);
vec3 New_P_Q32;
vec2 New_UV_Q32;
Move_Verts_B32(uv,Out_Radius_Q38,Anisotropy_Q21,Out_Line_Width_Q38,Width_Q55,New_P_Q32,New_UV_Q32);
vec3 Pos_World_Q12;
Object_To_World_Pos_B12(New_P_Q32,Pos_World_Q12);
vec3 Out_Position_Q40;
vec2 Out_UV_Q40;
vec3 Blob_Info_Q40;
vec2 Blob_Relative_UV_Q40;
Blob_Vertex_B40(Pos_World_Q12,Nrm_World_Q24,Tangent_World_N_Q15,Binormal_World_N_Q16,Position_Q27,_Blob_Intensity_,Near_Size_Q27,_Blob_Far_Size_,_Blob_Near_Distance_,_Blob_Far_Distance_,color,uv,Face_Center_Q30,Face_Size_Q35,New_UV_Q32,_Blob_Fade_Length_,_Selection_Fade_,_Selection_Fade_Size_,Inner_Fade_Q27,Pulse_Q27,Fade_Q27,Blob_Enable_Q27,0.0,Out_Position_Q40,Out_UV_Q40,Blob_Info_Q40,Blob_Relative_UV_Q40);
vec2 Rect_UV_Q36;
vec2 Scale_XY_Q36;
vec4 Rect_Parms_Q36;
Round_Rect_Vertex_B36(New_UV_Q32,Tangent_World_Q13,Binormal_World_Q14,Out_Radius_Q38,Anisotropy_Q21,Blob_Relative_UV_Q40,Rect_UV_Q36,Scale_XY_Q36,Rect_Parms_Q36);
vec4 Extra_Q33;
float Distance_To_Face_Q33;
float Distance_Fade1_Q33;
float Distance_Fade2_Q33;
Proximity_Vertex_B33(Result_Q42,Result_Q43,Face_Center_Q30,Pos_World_Q12,_Proximity_Far_Distance_,1.0,_Proximity_Anisotropy_,Nrm_World_Q24,Tangent_World_N_Q15,Binormal_World_N_Q16,Extra_Q33,Distance_To_Face_Q33,Distance_Fade1_Q33,Distance_Fade2_Q33);
vec4 Vec4_Q37=vec4(MaxAB_Q41,Distance_Fade1_Q33,Distance_Fade2_Q33,Out_Radius_Q38);
vec3 Position=Out_Position_Q40;
vec3 Normal=Vec3_Q29;
vec2 UV=Out_UV_Q40;
vec3 Tangent=Blob_Info_Q40;
vec3 Binormal=vec3(0,0,0);
vec4 Color=vec4(1,1,1,1);
vec4 Extra1=Rect_Parms_Q36;
vec4 Extra2=Extra_Q33;
vec4 Extra3=Vec4_Q37;
gl_Position=viewProjection*vec4(Position,1);
vNormal=Normal;
vUV=UV;
vTangent=Tangent;
vExtra1=Extra1;
vExtra2=Extra2;
vExtra3=Extra3;
}`;st.ShadersStore[xs]=Is;class ys extends Wt{constructor(){super(),this.SMOOTH_EDGES=!0,this._needNormals=!0,this._needUVs=!0,this.rebuild()}}class P extends zt{constructor(t,e){super(t,e),this.radius=.12,this.lineWidth=.01,this.relativeToHeight=!1,this._filterWidth=1,this.edgeColor=new M(.53,.53,.53,1),this.blobEnable=!0,this.blobPosition=new D(100,100,100),this.blobIntensity=.5,this.blobNearSize=.032,this.blobFarSize=.048,this.blobNearDistance=.008,this.blobFarDistance=.064,this.blobFadeLength=.04,this.blobInnerFade=.01,this.blobPulse=0,this.blobFade=1,this.blobPulseMaxSize=.05,this.blobEnable2=!0,this.blobPosition2=new D(10,10.1,-.6),this.blobNearSize2=.008,this.blobInnerFade2=.1,this.blobPulse2=0,this.blobFade2=1,this.gazeIntensity=.8,this.gazeFocus=0,this.selectionFuzz=.5,this.selected=1,this.selectionFade=.2,this.selectionFadeSize=0,this.selectedDistance=.08,this.selectedFadeLength=.08,this.proximityMaxIntensity=.45,this.proximityFarDistance=.16,this.proximityNearRadius=.016,this.proximityAnisotropy=1,this.useGlobalLeftIndex=!0,this.useGlobalRightIndex=!0,this.fadeOut=1,this.alphaMode=Rt.ALPHA_ADD,this.disableDepthWrite=!0,this.backFaceCulling=!1,this._blobTexture=new O(P.BLOB_TEXTURE_URL,e,!0,!1,O.NEAREST_SAMPLINGMODE)}needAlphaBlending(){return!0}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(t,e){if(this.isFrozen&&e.effect&&e.effect._wasPreviouslyReady)return!0;e.materialDefines||(e.materialDefines=new ys);const i=e.materialDefines,s=this.getScene();if(this._isReadyForSubMesh(e))return!0;const o=s.getEngine();if(L.PrepareDefinesForAttributes(t,i,!1,!1),i.isDirty){i.markAsProcessed(),s.resetCachedMaterial();const r=new qt;i.FOG&&r.addFallback(1,"FOG"),L.HandleFallbacksForShadows(i,r),i.IMAGEPROCESSINGPOSTPROCESS=s.imageProcessingConfiguration.applyByPostProcess;const a=[B.PositionKind];i.NORMAL&&a.push(B.NormalKind),i.UV1&&a.push(B.UVKind),i.UV2&&a.push(B.UV2Kind),i.VERTEXCOLOR&&a.push(B.ColorKind),i.TANGENT&&a.push(B.TangentKind),L.PrepareAttributesForInstances(a,i);const l="mrdlFrontplate",h=i.toString(),f=["world","worldView","worldViewProjection","view","projection","viewProjection","cameraPosition","_Radius_","_Line_Width_","_Relative_To_Height_","_Filter_Width_","_Edge_Color_","_Fade_Out_","_Smooth_Edges_","_Blob_Enable_","_Blob_Position_","_Blob_Intensity_","_Blob_Near_Size_","_Blob_Far_Size_","_Blob_Near_Distance_","_Blob_Far_Distance_","_Blob_Fade_Length_","_Blob_Inner_Fade_","_Blob_Pulse_","_Blob_Fade_","_Blob_Pulse_Max_Size_","_Blob_Enable_2_","_Blob_Position_2_","_Blob_Near_Size_2_","_Blob_Inner_Fade_2_","_Blob_Pulse_2_","_Blob_Fade_2_","_Gaze_Intensity_","_Gaze_Focus_","_Blob_Texture_","_Selection_Fuzz_","_Selected_","_Selection_Fade_","_Selection_Fade_Size_","_Selected_Distance_","_Selected_Fade_Length_","_Proximity_Max_Intensity_","_Proximity_Far_Distance_","_Proximity_Near_Radius_","_Proximity_Anisotropy_","Global_Left_Index_Tip_Position","Global_Right_Index_Tip_Position","_Use_Global_Left_Index_","_Use_Global_Right_Index_"],d=[],u=new Array;L.PrepareUniformsAndSamplersList({uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:i,maxSimultaneousLights:4}),e.setEffect(s.getEngine().createEffect(l,{attributes:a,uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:h,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),i)}return!e.effect||!e.effect.isReady()?!1:(i._renderId=s.getRenderId(),e.effect._wasPreviouslyReady=!0,!0)}bindForSubMesh(t,e,i){const s=this.getScene();if(!i.materialDefines)return;const r=i.effect;r&&(this._activeEffect=r,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("viewProjection",s.getTransformMatrix()),this._activeEffect.setVector3("cameraPosition",s.activeCamera.position),this._activeEffect.setFloat("_Radius_",this.radius),this._activeEffect.setFloat("_Line_Width_",this.lineWidth),this._activeEffect.setFloat("_Relative_To_Height_",this.relativeToHeight?1:0),this._activeEffect.setFloat("_Filter_Width_",this._filterWidth),this._activeEffect.setDirectColor4("_Edge_Color_",this.edgeColor),this._activeEffect.setFloat("_Fade_Out_",this.fadeOut),this._activeEffect.setFloat("_Blob_Enable_",this.blobEnable?1:0),this._activeEffect.setVector3("_Blob_Position_",this.blobPosition),this._activeEffect.setFloat("_Blob_Intensity_",this.blobIntensity),this._activeEffect.setFloat("_Blob_Near_Size_",this.blobNearSize),this._activeEffect.setFloat("_Blob_Far_Size_",this.blobFarSize),this._activeEffect.setFloat("_Blob_Near_Distance_",this.blobNearDistance),this._activeEffect.setFloat("_Blob_Far_Distance_",this.blobFarDistance),this._activeEffect.setFloat("_Blob_Fade_Length_",this.blobFadeLength),this._activeEffect.setFloat("_Blob_Inner_Fade_",this.blobInnerFade),this._activeEffect.setFloat("_Blob_Pulse_",this.blobPulse),this._activeEffect.setFloat("_Blob_Fade_",this.blobFade),this._activeEffect.setFloat("_Blob_Pulse_Max_Size_",this.blobPulseMaxSize),this._activeEffect.setFloat("_Blob_Enable_2_",this.blobEnable2?1:0),this._activeEffect.setVector3("_Blob_Position_2_",this.blobPosition2),this._activeEffect.setFloat("_Blob_Near_Size_2_",this.blobNearSize2),this._activeEffect.setFloat("_Blob_Inner_Fade_2_",this.blobInnerFade2),this._activeEffect.setFloat("_Blob_Pulse_2_",this.blobPulse2),this._activeEffect.setFloat("_Blob_Fade_2_",this.blobFade2),this._activeEffect.setFloat("_Gaze_Intensity_",this.gazeIntensity),this._activeEffect.setFloat("_Gaze_Focus_",this.gazeFocus),this._activeEffect.setTexture("_Blob_Texture_",this._blobTexture),this._activeEffect.setFloat("_Selection_Fuzz_",this.selectionFuzz),this._activeEffect.setFloat("_Selected_",this.selected),this._activeEffect.setFloat("_Selection_Fade_",this.selectionFade),this._activeEffect.setFloat("_Selection_Fade_Size_",this.selectionFadeSize),this._activeEffect.setFloat("_Selected_Distance_",this.selectedDistance),this._activeEffect.setFloat("_Selected_Fade_Length_",this.selectedFadeLength),this._activeEffect.setFloat("_Proximity_Max_Intensity_",this.proximityMaxIntensity),this._activeEffect.setFloat("_Proximity_Far_Distance_",this.proximityFarDistance),this._activeEffect.setFloat("_Proximity_Near_Radius_",this.proximityNearRadius),this._activeEffect.setFloat("_Proximity_Anisotropy_",this.proximityAnisotropy),this._activeEffect.setFloat("_Use_Global_Left_Index_",this.useGlobalLeftIndex?1:0),this._activeEffect.setFloat("_Use_Global_Right_Index_",this.useGlobalRightIndex?1:0),this._afterBind(e,this._activeEffect))}getAnimatables(){return[]}dispose(t){super.dispose(t)}clone(t){return H.Clone(()=>new P(t,this.getScene()),this)}serialize(){const t=H.Serialize(this);return t.customType="BABYLON.MRDLFrontplateMaterial",t}getClassName(){return"MRDLFrontplateMaterial"}static Parse(t,e,i){return H.Parse(()=>new P(t.name,e),t,e,i)}}P.BLOB_TEXTURE_URL="";n([_()],P.prototype,"radius",void 0);n([_()],P.prototype,"lineWidth",void 0);n([_()],P.prototype,"relativeToHeight",void 0);n([_()],P.prototype,"edgeColor",void 0);n([_()],P.prototype,"blobEnable",void 0);n([_()],P.prototype,"blobPosition",void 0);n([_()],P.prototype,"blobIntensity",void 0);n([_()],P.prototype,"blobNearSize",void 0);n([_()],P.prototype,"blobFarSize",void 0);n([_()],P.prototype,"blobNearDistance",void 0);n([_()],P.prototype,"blobFarDistance",void 0);n([_()],P.prototype,"blobFadeLength",void 0);n([_()],P.prototype,"blobInnerFade",void 0);n([_()],P.prototype,"blobPulse",void 0);n([_()],P.prototype,"blobFade",void 0);n([_()],P.prototype,"blobPulseMaxSize",void 0);n([_()],P.prototype,"blobEnable2",void 0);n([_()],P.prototype,"blobPosition2",void 0);n([_()],P.prototype,"blobNearSize2",void 0);n([_()],P.prototype,"blobInnerFade2",void 0);n([_()],P.prototype,"blobPulse2",void 0);n([_()],P.prototype,"blobFade2",void 0);n([_()],P.prototype,"gazeIntensity",void 0);n([_()],P.prototype,"gazeFocus",void 0);n([_()],P.prototype,"selectionFuzz",void 0);n([_()],P.prototype,"selected",void 0);n([_()],P.prototype,"selectionFade",void 0);n([_()],P.prototype,"selectionFadeSize",void 0);n([_()],P.prototype,"selectedDistance",void 0);n([_()],P.prototype,"selectedFadeLength",void 0);n([_()],P.prototype,"proximityMaxIntensity",void 0);n([_()],P.prototype,"proximityFarDistance",void 0);n([_()],P.prototype,"proximityNearRadius",void 0);n([_()],P.prototype,"proximityAnisotropy",void 0);n([_()],P.prototype,"useGlobalLeftIndex",void 0);n([_()],P.prototype,"useGlobalRightIndex",void 0);F("BABYLON.GUI.MRDLFrontplateMaterial",P);const Bs="mrdlInnerquadPixelShader",Cs=`uniform vec3 cameraPosition;
varying vec2 vUV;
varying vec3 vTangent;
uniform vec4 _Color_;
uniform float _Radius_;
uniform bool _Fixed_Radius_;
uniform float _Filter_Width_;
uniform float _Glow_Fraction_;
uniform float _Glow_Max_;
uniform float _Glow_Falloff_;
float FilterStep_Bid194(float edge,float x,float filterWidth)
{
float dx=max(1.0E-5,fwidth(x)*filterWidth);
return max((x+dx*0.5-max(edge,x-dx*0.5))/dx,0.0);
}
void Round_Rect_B194(
float Size_X,
float Size_Y,
float Radius,
vec4 Rect_Color,
float Filter_Width,
vec2 UV,
float Glow_Fraction,
float Glow_Max,
float Glow_Falloff,
out vec4 Color)
{
vec2 halfSize=vec2(Size_X,Size_Y)*0.5;
vec2 r=max(min(vec2(Radius,Radius),halfSize),vec2(0.01,0.01));
vec2 v=abs(UV);
vec2 nearestp=min(v,halfSize-r);
vec2 delta=(v-nearestp)/max(vec2(0.01,0.01),r);
float Distance=length(delta);
float insideRect=1.0-FilterStep_Bid194(1.0-Glow_Fraction,Distance,Filter_Width);
float glow=clamp((1.0-Distance)/Glow_Fraction,0.0,1.0);
glow=pow(glow,Glow_Falloff);
Color=Rect_Color*max(insideRect,glow*Glow_Max);
}
void main()
{
float X_Q192;
float Y_Q192;
float Z_Q192;
X_Q192=vTangent.x;
Y_Q192=vTangent.y;
Z_Q192=vTangent.z;
vec4 Color_Q194;
Round_Rect_B194(X_Q192,1.0,Y_Q192,_Color_,_Filter_Width_,vUV,_Glow_Fraction_,_Glow_Max_,_Glow_Falloff_,Color_Q194);
vec4 Out_Color=Color_Q194;
float Clip_Threshold=0.0;
gl_FragColor=Out_Color;
}
`;st.ShadersStore[Bs]=Cs;const Ts="mrdlInnerquadVertexShader",Ss=`uniform mat4 world;
uniform mat4 viewProjection;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 tangent;
attribute vec4 color;
uniform vec4 _Color_;
uniform float _Radius_;
uniform bool _Fixed_Radius_;
uniform float _Filter_Width_;
uniform float _Glow_Fraction_;
uniform float _Glow_Max_;
uniform float _Glow_Falloff_;
varying vec2 vUV;
varying vec3 vTangent;
void main()
{
vec3 Pos_World_Q189;
Pos_World_Q189=(world*vec4(position,1.0)).xyz;
vec3 Dir_World_Q190;
Dir_World_Q190=(world*vec4(tangent,0.0)).xyz;
vec3 Dir_World_Q191;
Dir_World_Q191=(world*vec4((cross(normal,tangent)),0.0)).xyz;
float Length_Q180=length(Dir_World_Q190);
float Length_Q181=length(Dir_World_Q191);
float Quotient_Q184=Length_Q180/Length_Q181;
float Quotient_Q195=_Radius_/Length_Q181;
vec2 Result_Q193;
Result_Q193=vec2((uv.x-0.5)*Length_Q180/Length_Q181,(uv.y-0.5));
float Result_Q198=_Fixed_Radius_ ? Quotient_Q195 : _Radius_;
vec3 Vec3_Q183=vec3(Quotient_Q184,Result_Q198,0);
vec3 Position=Pos_World_Q189;
vec3 Normal=vec3(0,0,0);
vec2 UV=Result_Q193;
vec3 Tangent=Vec3_Q183;
vec3 Binormal=vec3(0,0,0);
vec4 Color=color;
gl_Position=viewProjection*vec4(Position,1);
vUV=UV;
vTangent=Tangent;
}
`;st.ShadersStore[Ts]=Ss;class Rs extends Wt{constructor(){super(),this._needNormals=!0,this._needUVs=!0,this.rebuild()}}class Nt extends zt{constructor(t,e){super(t,e),this.color=new M(1,1,1,.05),this.radius=.12,this.fixedRadius=!0,this._filterWidth=1,this.glowFraction=0,this.glowMax=.5,this.glowFalloff=2,this.alphaMode=Rt.ALPHA_COMBINE,this.backFaceCulling=!1}needAlphaBlending(){return!0}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(t,e){if(this.isFrozen&&e.effect&&e.effect._wasPreviouslyReady)return!0;e.materialDefines||(e.materialDefines=new Rs);const i=e.materialDefines,s=this.getScene();if(this._isReadyForSubMesh(e))return!0;const o=s.getEngine();if(L.PrepareDefinesForAttributes(t,i,!0,!1),i.isDirty){i.markAsProcessed(),s.resetCachedMaterial();const r=new qt;i.FOG&&r.addFallback(1,"FOG"),L.HandleFallbacksForShadows(i,r),i.IMAGEPROCESSINGPOSTPROCESS=s.imageProcessingConfiguration.applyByPostProcess;const a=[B.PositionKind];i.NORMAL&&a.push(B.NormalKind),i.UV1&&a.push(B.UVKind),i.UV2&&a.push(B.UV2Kind),i.VERTEXCOLOR&&a.push(B.ColorKind),i.TANGENT&&a.push(B.TangentKind),L.PrepareAttributesForInstances(a,i);const l="mrdlInnerquad",h=i.toString(),f=["world","worldView","worldViewProjection","view","projection","viewProjection","cameraPosition","_Color_","_Radius_","_Fixed_Radius_","_Filter_Width_","_Glow_Fraction_","_Glow_Max_","_Glow_Falloff_"],d=[],u=new Array;L.PrepareUniformsAndSamplersList({uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:i,maxSimultaneousLights:4}),e.setEffect(s.getEngine().createEffect(l,{attributes:a,uniformsNames:f,uniformBuffersNames:u,samplers:d,defines:h,fallbacks:r,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),i)}return!e.effect||!e.effect.isReady()?!1:(i._renderId=s.getRenderId(),e.effect._wasPreviouslyReady=!0,!0)}bindForSubMesh(t,e,i){const s=this.getScene();if(!i.materialDefines)return;const r=i.effect;r&&(this._activeEffect=r,this.bindOnlyWorldMatrix(t),this._activeEffect.setMatrix("viewProjection",s.getTransformMatrix()),this._activeEffect.setVector3("cameraPosition",s.activeCamera.position),this._activeEffect.setDirectColor4("_Color_",this.color),this._activeEffect.setFloat("_Radius_",this.radius),this._activeEffect.setFloat("_Fixed_Radius_",this.fixedRadius?1:0),this._activeEffect.setFloat("_Filter_Width_",this._filterWidth),this._activeEffect.setFloat("_Glow_Fraction_",this.glowFraction),this._activeEffect.setFloat("_Glow_Max_",this.glowMax),this._activeEffect.setFloat("_Glow_Falloff_",this.glowFalloff),this._afterBind(e,this._activeEffect))}getAnimatables(){return[]}dispose(t){super.dispose(t)}clone(t){return H.Clone(()=>new Nt(t,this.getScene()),this)}serialize(){const t=H.Serialize(this);return t.customType="BABYLON.MRDLInnerquadMaterial",t}getClassName(){return"MRDLInnerquadMaterial"}static Parse(t,e,i){return H.Parse(()=>new Nt(t.name,e),t,e,i)}}n([_()],Nt.prototype,"color",void 0);n([_()],Nt.prototype,"radius",void 0);n([_()],Nt.prototype,"fixedRadius",void 0);n([_()],Nt.prototype,"glowFraction",void 0);n([_()],Nt.prototype,"glowMax",void 0);n([_()],Nt.prototype,"glowFalloff",void 0);F("BABYLON.GUI.MRDLInnerquadMaterial",Nt);
