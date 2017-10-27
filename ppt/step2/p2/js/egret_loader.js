/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

egret_h5.startGame = function () {

    if (h5site.util.Tools.isInWeixin() && (window.innerHeight == window.screen.height)) {
        //alert("wrong");
        //location.reload(true);
    }

    /*h5site.trace.isDebug = DEBUG;
     h5site.logic.Tracking._czc = _czc;*/

    h5site.logic.ExchangeData.setDefaultPageName(h5site.util.Tools.getRequestParams('pageName'));

    if (h5site.util.Tools.getRequestParams('headimgurl') != undefined) {
        h5site.logic.ExchangeData.nickName = h5site.util.Tools.getRequestParams('nickname');
        h5site.logic.ExchangeData.opendid = h5site.util.Tools.getRequestParams('openid');
        h5site.logic.ExchangeData.iconUrl = h5site.util.Tools.getRequestParams('headimgurl');
        h5site.logic.ExchangeData.vip = h5site.util.Tools.getRequestParams('vip');
    }

    var context = egret.MainContext.instance;
    context.touchContext = new egret.HTML5TouchContext();
    context.deviceContext = new egret.HTML5DeviceContext();
    context.netContext = new egret.HTML5NetContext();

    if (h5site.util.Tools.isMobieDevice()) {
        egret.StageDelegate.getInstance().setDesignSize(640, 1008);
    } else {
        egret.StageDelegate.getInstance().setDesignSize(1920, 1080);
    }
    context.stage = new egret.Stage();
    //var scaleMode =  egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE ? egret.StageScaleMode.SHOW_ALL : egret.StageScaleMode.NO_SCALE;
    context.stage.scaleMode = egret.StageScaleMode.NO_BORDER;
    //context.stage.scaleMode = egret.StageScaleMode.NO_SCALE;


    //WebGL鏄痚gret鐨凚eta鐗规€э紝榛樿鍏抽棴
    var rendererType = 0;//egret.WebGLUtils.checkCanUseWebGL();
    if (rendererType == 1) {
        console.log("浣跨敤WebGL妯″紡");
        context.rendererContext = new egret.WebGLRenderer();
    }
    else {
        context.rendererContext = new egret.HTML5CanvasRenderer();
    }

    egret.MainContext.instance.rendererContext.texture_scale_factor = 1;
    context.run();

    var rootClass;
    if (document_class) {
        rootClass = egret.getDefinitionByName(document_class);
    }
    if (rootClass) {
        var rootContainer = new rootClass();
        if (rootContainer instanceof egret.DisplayObjectContainer) {
            context.stage.addChild(rootContainer);
        }
        else {
            throw new Error("鏂囨。绫诲繀椤绘槸egret.DisplayObjectContainer鐨勫瓙绫�!");
        }
    }
    else {
        throw new Error("鎵句笉鍒版枃妗ｇ被锛�");
    }

    //澶勭悊灞忓箷澶у皬鏀瑰彉
    var resizeTimer = null;
    var doResize = function () {
        context.stage.changeSize();
        resizeTimer = null;
    };
    window.onresize = function () {
        if (resizeTimer == null) {
            resizeTimer = setTimeout(doResize, 300);
        }
    };
};