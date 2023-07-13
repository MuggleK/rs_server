





trashvm = {}
trashvm.proxy = function(obj){

    return new Proxy(obj,{
        set(target,property,value)
        {
            target.constructor.name,property,target[property]

            console.log(["SET",target.constructor.name, property,value]);
            return Reflect.set(...arguments);
        },
        get(target,property,receiver)
        {

            console.log(["GET",target.constructor.name, property,target[property]]);
            //debugger;
            return target[property];
        }
    });
};
debugger;
(() => {
    "use strict";
    const $toString = Function.toString;
    const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random() + '').toString(36)));
    const myToString = function() {
        return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this);
    };
    function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            "enumerable": false,
            "configurable": true,
            "writable": true,
            "value": value
        })
    };
    delete Function.prototype['toString']; //删除原型链上的toString
    set_native(Function.prototype, "toString", myToString); //自己定义个getter方法
    set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }"); //套个娃 保护一下我们定义的toString 否则就暴露了
    trashvm.func_set_natvie = (func) => {
        if(typeof func == "undefined"){
            return
        }
        set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`);
    }; //导出函数到globalThis
}).call(this);



// Function.prototype.toString = new Proxy(Function.prototype.toString, {
//     apply: (target,ctx,args)=>{
//         if(ctx[Symbol.toStringTag]){
//             return ctx[Symbol.toStringTag];
//         }
//         let value = Reflect.apply(target,ctx,args);
//         //   console.log('apply', args, value);
//         let repl = value.replace(/[\n\r]/g,'').replace(/\s/g,'')
//         repl = repl.replace(new RegExp(/function/ig,"gm"),'function ')
//         repl = repl.replace(new RegExp(/return/ig,"gm"),'return ')
//         repl = repl.replace(new RegExp(/var/ig,"gm"),'var ')
//         repl = repl.replace(new RegExp(/{\[nativecode\]/ig,"gm"),' { [native code] }')
//         return repl;
//     },
// });



/**
 *
 * EventTarget
 */
//这个是创建一个EvetTaget的构造函数
var EventTarget = function EventTarget()
{
    //EventTaget是可以被new出来的，所以什么都不用处理
};trashvm.func_set_natvie(EventTarget);

Object.defineProperties(EventTarget.prototype,{
    [Symbol.toStringTag]:{
        value:"EventTarget",
        configurable:true
    }
});

//补充EventTarget原型下的方法
//addEventListener
EventTarget.prototype.addEventListener = function addEventListener(){
    //方法体
    //debugger;
};trashvm.func_set_natvie(EventTarget.prototype.addEventListener);//对这个方法进行保护

//dispatchEvent
EventTarget.prototype.dispatchEvent = function dispatchEvent(){
    //方法体
    debugger;
};trashvm.func_set_natvie(EventTarget.prototype.dispatchEvent);//对这个方法进行保护

//removeEventListener
EventTarget.prototype.removeEventListener = function removeEventListener(){
    //方法体
    debugger;
};trashvm.func_set_natvie(EventTarget.prototype.removeEventListener);//对这个方法进行保护



//这个是创建一个WindowProperties 的构造函数
var WindowProperties  = function WindowProperties()
{
    throw new ReferenceError("WindowProperties is not defined")
};trashvm.func_set_natvie(WindowProperties );

Object.defineProperties(WindowProperties .prototype,{
    [Symbol.toStringTag]:{
        value:"WindowProperties ",
        configurable:true
    }
});



//WindowProperties的实例的父对象指向EventTarget的实例
WindowProperties.prototype.__proto__ = EventTarget.prototype;



/**
 *
 * window
 */
 window = global;


 //这个是创建一个Window的构造函数
 var Window = function Window()
 {
     throw new TypeError("Illegal constructor") //Window是不能被new的
 };trashvm.func_set_natvie(Window);

 Object.defineProperties(Window.prototype,{
     [Symbol.toStringTag]:{
         value:"Window",
         configurable:true
     }
 });

 //Window实例的父对象指向WindowProperties的原型
Window.prototype.__proto__ = WindowProperties.prototype;
Window.__proto__ = EventTarget;
window.__proto__ = Window.prototype;
window = window;
window.top = window;
window.name = '';
window.indexedDB ={
    open:function open(name,number){
        return {};
    }
};
window.chrome = {};
window.setTimeout = function setTimeout(x,d){
    typeof(x) == "function"?x():undefined;
    typeof(x) == "string"?eval(x):undefined;
    return 0;
};

window.a = {};
window.scrollbars = {};
window.Atomics = {};
window.name = '';
window.chrome = {
    csi:function(){
        return {
            onloadT: new Date().getTime(),
            pageT: 168333.548,
            startE: new Date().getTime()-378,
            tran: 15,
        }
    },
    loadTimes:function(){
        return {
            commitLoadTime: 1642559969.288,
            connectionInfo: "http/1.1",
            finishDocumentLoadTime: 1642559969.371,
            finishLoadTime: 1642559969.999,
            firstPaintAfterLoadTime: 0,
            firstPaintTime: 1642559969.436,
            navigationType: "Other",
            npnNegotiatedProtocol: "unknown",
            requestTime: 1642559968.281,
            startLoadTime: 1642559968.281,
            wasAlternateProtocolAvailable: false,
            wasFetchedViaSpdy: false,
            wasNpnNegotiated: false,
        }
    },
    app:{
        InstallState:{
            DISABLED: "disabled",
            INSTALLED: "installed",
            NOT_INSTALLED: "not_installed",
        },
        RunningState:{
            CANNOT_RUN: "cannot_run",
            READY_TO_RUN: "ready_to_run",
            RUNNING: "running",
        },
        getDetails: function getDetails(){},
        getIsInstalled: function getIsInstalled(){},
        installState: function installState(){},
        isInstalled: false,
        runningState: function runningState(){}
    },
    runtime:{
        OnInstalledReason:{
            CHROME_UPDATE: "chrome_update",
            INSTALL: "install",
            SHARED_MODULE_UPDATE: "shared_module_update",
            UPDATE: "update",
        },
        OnRestartRequiredReason:{
            APP_UPDATE: "app_update",
            OS_UPDATE: "os_update",
            PERIODIC: "periodic",
        },
        PlatformArch:{
            ARM: "arm",
            ARM64: "arm64",
            MIPS: "mips",
            MIPS64: "mips64",
            X86_32: "x86-32",
            X86_64: "x86-64",
        },
        PlatformNaclArch:{
            ARM: "arm",
            MIPS: "mips",
            MIPS64: "mips64",
            X86_32: "x86-32",
            X86_64: "x86-64",
        },
        PlatformOs:{
            ANDROID: "android",
            CROS: "cros",
            LINUX: "linux",
            MAC: "mac",
            OPENBSD: "openbsd",
            WIN: "win",
        },
        RequestUpdateCheckStatus:{
            NO_UPDATE: "no_update",
            THROTTLED: "throttled",
            UPDATE_AVAILABLE: "update_available",
        },
        connect:function connect(){},
        id:undefined,
        sendMessage:function sendMessage(){}
    }
};
trashvm.func_set_natvie(window.chrome.csi);
trashvm.func_set_natvie(window.chrome.loadTimes);
trashvm.func_set_natvie(window.chrome.app.getDetails);
trashvm.func_set_natvie(window.chrome.app.getIsInstalled);
trashvm.func_set_natvie(window.chrome.app.installState);
trashvm.func_set_natvie(window.chrome.app.runningState);
trashvm.func_set_natvie(window.chrome.runtime.sendMessage);
trashvm.func_set_natvie(window.chrome.runtime.connect);

Worker = function() {
    return port1;
}
;trashvm.func_set_natvie(Worker);

window.Accelerometer = function () {}
;trashvm.func_set_natvie(Accelerometer);
window.AnalyserNode = function AnalyserNode() {}
;trashvm.func_set_natvie(AnalyserNode);
window.Animation = function Animation() {}
;trashvm.func_set_natvie(Animation);
window.AnimationEffect = function AnimationEffect() {}
;trashvm.func_set_natvie(AnimationEffect);
window.AnimationPlaybackEvent = function AnimationPlaybackEvent() {}
;trashvm.func_set_natvie(AnimationPlaybackEvent);
window.AnimationTimeline = function AnimationTimeline() {}
;trashvm.func_set_natvie(AnimationTimeline);
window.Attr = function Attr() {}
;trashvm.func_set_natvie(Attr);
window.Audio = function Audio() {}
;trashvm.func_set_natvie(Audio);
window.AudioBuffer = function AudioBuffer() {}
;trashvm.func_set_natvie(AudioBuffer);
window.AudioBufferSourceNode = function AudioBufferSourceNode() {}
;trashvm.func_set_natvie(AudioBufferSourceNode);
window.AudioContext = function AudioContext() {}
;trashvm.func_set_natvie(AudioContext);
window.AudioData = function AudioData() {}
;trashvm.func_set_natvie(AudioData);

window.AudioDecoder = function AudioDecoder() {}
;trashvm.func_set_natvie(AudioDecoder);

window.AudioDestinationNode = function AudioDestinationNode() {}
;trashvm.func_set_natvie(AudioDestinationNode);
window.AudioEncoder = function AudioEncoder() {}
;trashvm.func_set_natvie(AudioEncoder);

window.AudioListener = function AudioListener() {}
;trashvm.func_set_natvie(AudioListener);
window.AudioNode = function() {}
;trashvm.func_set_natvie(AudioNode);
window.AudioParam = function() {}
;trashvm.func_set_natvie(AudioParam);
window.AudioParamMap = function() {}
;trashvm.func_set_natvie(AudioParamMap);
window.AudioProcessingEvent = function() {}
;trashvm.func_set_natvie(AudioProcessingEvent);
window.AudioScheduledSourceNode = function() {}
;trashvm.func_set_natvie(AudioScheduledSourceNode);
window.AudioWorklet = function() {}
;trashvm.func_set_natvie(AudioWorklet);
window.AudioWorkletNode = function() {}
;trashvm.func_set_natvie(AudioWorkletNode);
window.AuthenticatorAssertionResponse = function() {}
;trashvm.func_set_natvie(AuthenticatorAssertionResponse);
window.AuthenticatorAttestationResponse = function() {}
;trashvm.func_set_natvie(AuthenticatorAttestationResponse);
window.AuthenticatorResponse = function() {}
;trashvm.func_set_natvie(AuthenticatorResponse);
window.BackgroundFetchManager = function() {}
;trashvm.func_set_natvie(BackgroundFetchManager);
window.BackgroundFetchRegistration = function() {}
;trashvm.func_set_natvie(BackgroundFetchRegistration);
window.BaseAudioContext = function() {}
;trashvm.func_set_natvie(BaseAudioContext);
window.BatteryManager = function() {}
;trashvm.func_set_natvie(BatteryManager);
window.BeforeInstallPromptEvent = function() {}
;trashvm.func_set_natvie(BeforeInstallPromptEvent);
window.BeforeUnloadEvent = function() {}
;trashvm.func_set_natvie(BeforeUnloadEvent);
window.BiquadFilterNode = function() {}
;trashvm.func_set_natvie(BiquadFilterNode);
window.BackgroundFetchRecord = function() {}
;trashvm.func_set_natvie(BackgroundFetchRecord);
window.BarProp = function() {}
;trashvm.func_set_natvie(BarProp);
window.AnimationEvent = function() {}
;trashvm.func_set_natvie(AnimationEvent);



window.BroadcastChannel = function() {}
;trashvm.func_set_natvie(BroadcastChannel);
window.ByteLengthQueuingStrategy = function() {}
;trashvm.func_set_natvie(ByteLengthQueuingStrategy);
window.CDATASection = function() {}
;trashvm.func_set_natvie(CDATASection);
window.CSSConditionRule = function() {}
;trashvm.func_set_natvie(CSSConditionRule);
window.CanvasPattern = function() {}
;trashvm.func_set_natvie(CanvasPattern);
window.Credential = function() {}
;trashvm.func_set_natvie(Credential);
window.Crypto = function() {}
;trashvm.func_set_natvie(Crypto);
window.CustomEvent = function() {}
;trashvm.func_set_natvie(CustomEvent);

window.DocumentTimeline = function() {}
;trashvm.func_set_natvie(DocumentTimeline);
window.DocumentType = function() {}
;trashvm.func_set_natvie(DocumentType);

window.EncodedVideoChunk = function() {}
;trashvm.func_set_natvie(EncodedVideoChunk);


window.FocusEvent = function() {}
;trashvm.func_set_natvie(FocusEvent);
window.GainNode = function() {}
;trashvm.func_set_natvie(GainNode);
window.HTMLLIElement = function() {}
;trashvm.func_set_natvie(HTMLLIElement);
window.HTMLProgressElement = function() {}
;trashvm.func_set_natvie(HTMLProgressElement);
window.MediaSource = function() {}
;trashvm.func_set_natvie(MediaSource);

















window.Blob = function(a,b) {
    this.a=a[0]
}
;trashvm.func_set_natvie(Blob);
window.BlobEvent = function() {}
;trashvm.func_set_natvie(BlobEvent);
window.Bluetooth = function() {}
;trashvm.func_set_natvie(Bluetooth);
window.BluetoothCharacteristicProperties = function() {}
;trashvm.func_set_natvie(BluetoothCharacteristicProperties);
window.BluetoothDevice = function() {}
;trashvm.func_set_natvie(BluetoothDevice);
window.BluetoothRemoteGATTCharacteristic = function() {}
;trashvm.func_set_natvie(BluetoothRemoteGATTCharacteristic);
window.BluetoothRemoteGATTDescriptor = function() {}
;trashvm.func_set_natvie(BluetoothRemoteGATTDescriptor);
window.BluetoothRemoteGATTServer = function() {}
;trashvm.func_set_natvie(BluetoothRemoteGATTServer);
window.BluetoothRemoteGATTService = function() {}
;trashvm.func_set_natvie(BluetoothRemoteGATTService);
window.BluetoothUUID = function() {}
;trashvm.func_set_natvie(BluetoothUUID);
window.CSS = {}
;
window.CSSAnimation = function() {}
;trashvm.func_set_natvie(CSSAnimation);
window.CSSCounterStyleRule = function() {}
;trashvm.func_set_natvie(CSSCounterStyleRule);
window.CSSFontFaceRule = function() {}
;trashvm.func_set_natvie(CSSFontFaceRule);
window.CSSGroupingRule = function() {}
;trashvm.func_set_natvie(CSSGroupingRule);
window.CSSImageValue = function() {}
;trashvm.func_set_natvie(CSSImageValue);
window.CSSImportRule = function() {}
;trashvm.func_set_natvie(CSSImportRule);
window.CSSKeyframeRule = function() {}
;trashvm.func_set_natvie(CSSKeyframeRule);
window.CSSKeyframesRule = function() {}
;trashvm.func_set_natvie(CSSKeyframesRule);
window.CSSMathInvert = function() {}
;trashvm.func_set_natvie(CSSMathInvert);
window.CSSKeywordValue = function() {}
;trashvm.func_set_natvie(CSSKeywordValue);
window.CSSMathMax = function() {}
;trashvm.func_set_natvie(CSSMathMax);
window.CSSMathMin = function() {}
;trashvm.func_set_natvie(CSSMathMin);
window.CSSMathNegate = function() {}
;trashvm.func_set_natvie(CSSMathNegate);
window.CSSMathProduct = function() {}
;trashvm.func_set_natvie(CSSMathProduct);
window.CSSMathSum = function() {}
;trashvm.func_set_natvie(CSSMathSum);
window.CSSMathValue = function() {}
;trashvm.func_set_natvie(CSSMathValue);
window.CSSMatrixComponent = function() {}
;trashvm.func_set_natvie(CSSMatrixComponent);
window.CSSMediaRule = function() {}
;trashvm.func_set_natvie(CSSMediaRule);
window.CSSNamespaceRule = function() {}
;trashvm.func_set_natvie(CSSNamespaceRule);
window.CSSNumericArray = function() {}
;trashvm.func_set_natvie(CSSNumericArray);
window.CSSNumericValue = function() {}
;trashvm.func_set_natvie(CSSNumericValue);
window.CSSPageRule = function() {}
;trashvm.func_set_natvie(CSSPageRule);
window.CSSPerspective = function() {}
;trashvm.func_set_natvie(CSSPerspective);
window.CSSPositionValue = function() {}
;trashvm.func_set_natvie(CSSPositionValue);
window.CSSPropertyRule = function() {}
;trashvm.func_set_natvie(CSSPropertyRule);
window.CSSRotate = function() {}
;trashvm.func_set_natvie(CSSRotate);
window.CSSRule = function() {}
;trashvm.func_set_natvie(CSSRule);
window.CSSRuleList = function() {}
;trashvm.func_set_natvie(CSSRuleList);
window.CSSScale = function() {}
;trashvm.func_set_natvie(CSSScale);
window.CSSSkew = function() {}
;trashvm.func_set_natvie(CSSSkew);
window.CSSSkewX = function() {}
;trashvm.func_set_natvie(CSSSkewX);
window.CSSSkewY = function() {}
;trashvm.func_set_natvie(CSSSkewY);
window.CSSStyleDeclaration = function() {}
;trashvm.func_set_natvie(CSSStyleDeclaration);
window.CSSStyleRule = function() {}
;trashvm.func_set_natvie(CSSStyleRule);
window.CSSStyleSheet = function() {}
;trashvm.func_set_natvie(CSSStyleSheet);
window.CSSStyleValue = function() {}
;trashvm.func_set_natvie(CSSStyleValue);

window.CSSSupportsRule = function() {}
;trashvm.func_set_natvie(CSSSupportsRule);
window.CSSTransformComponent = function() {}
;trashvm.func_set_natvie(CSSTransformComponent);
window.CSSTransformValue = function() {}
;trashvm.func_set_natvie(CSSTransformValue);

window.setInterval = function setInterval(){return 1};
window.clearInterval = function clearInterval(){};
window.CSSTransition = function() {}
;trashvm.func_set_natvie(CSSTransition);
window.CSSTranslate = function() {}
;trashvm.func_set_natvie(CSSTranslate);
window.CSSUnitValue = function() {}
;trashvm.func_set_natvie(CSSUnitValue);
window.CSSUnparsedValue = function() {}
;trashvm.func_set_natvie(CSSUnparsedValue);
window.CSSVariableReferenceValue = function() {}
;trashvm.func_set_natvie(CSSVariableReferenceValue);
window.Cache = function() {}
;trashvm.func_set_natvie(Cache);
window.CacheStorage = function() {}
;trashvm.func_set_natvie(CacheStorage);
window.CanvasCaptureMediaStreamTrack = function() {}
;trashvm.func_set_natvie(CanvasCaptureMediaStreamTrack);
window.CanvasGradient = function() {}
;trashvm.func_set_natvie(CanvasGradient);
window.CanvasRenderingContext2D = function() {}
;trashvm.func_set_natvie(CanvasRenderingContext2D);
window.ChannelMergerNode = function() {}
;trashvm.func_set_natvie(ChannelMergerNode);
window.ChannelSplitterNode = function() {}
;trashvm.func_set_natvie(ChannelSplitterNode);
window.CharacterData = function() {}
;trashvm.func_set_natvie(CharacterData);
window.Clipboard = function() {}
;trashvm.func_set_natvie(Clipboard);
window.ClipboardEvent = function() {}
;trashvm.func_set_natvie(ClipboardEvent);
window.ClipboardItem = function() {}
;trashvm.func_set_natvie(ClipboardItem);
window.CloseEvent = function() {}
;trashvm.func_set_natvie(CloseEvent);
window.Comment = function() {}
;trashvm.func_set_natvie(Comment);
window.CompositionEvent = function() {}
;trashvm.func_set_natvie(CompositionEvent);
window.CompressionStream = function() {}
;trashvm.func_set_natvie(CompressionStream);
window.ConstantSourceNode = function() {}
;trashvm.func_set_natvie(ConstantSourceNode);
window.ConvolverNode = function() {}
;trashvm.func_set_natvie(ConvolverNode);
window.CookieChangeEvent = function() {}
;trashvm.func_set_natvie(CookieChangeEvent);

window.CookieStore = {};
window.CookieStoreManager = function() {}
;trashvm.func_set_natvie(CookieStoreManager);
window.CountQueuingStrategy = function() {}
;trashvm.func_set_natvie(CountQueuingStrategy);
window.CredentialsContainer = function() {}
;trashvm.func_set_natvie(CredentialsContainer);
window.CryptoKey = function() {}
;trashvm.func_set_natvie(CryptoKey);
window.CustomElementRegistry = function() {}
;trashvm.func_set_natvie(CustomElementRegistry);
window.CustomStateSet = function() {}
;trashvm.func_set_natvie(CustomStateSet);
window.DOMError = function() {}
;trashvm.func_set_natvie(DOMError);
window.DOMException = function() {}
;trashvm.func_set_natvie(DOMException);
window.DOMImplementation = function() {}
;trashvm.func_set_natvie(DOMImplementation);
window.DOMMatrix = function() {}
;trashvm.func_set_natvie(DOMMatrix);
window.DOMMatrixReadOnly = function() {}
;trashvm.func_set_natvie(DOMMatrixReadOnly);
window.DOMParser = function() {}
;trashvm.func_set_natvie(DOMParser);
window.DOMPoint = function() {}
;trashvm.func_set_natvie(DOMPoint);
window.DOMPointReadOnly = function() {}
;trashvm.func_set_natvie(DOMPointReadOnly);
window.DOMQuad = function() {}
;trashvm.func_set_natvie(DOMQuad);
window.DOMRect = function() {}
;trashvm.func_set_natvie(DOMRect);
window.DOMRectList = function() {}
;trashvm.func_set_natvie(DOMRectList);
window.DOMRectReadOnly = function() {}
;trashvm.func_set_natvie(DOMRectReadOnly);
window.DOMStringList = function() {}
;trashvm.func_set_natvie(DOMStringList);
window.DOMStringMap = function() {}
;trashvm.func_set_natvie(DOMStringMap);
window.DOMTokenList = function() {}
;trashvm.func_set_natvie(DOMTokenList);
window.DataTransfer = function() {}
;trashvm.func_set_natvie(DataTransfer);
window.DataTransferItem = function() {}
;trashvm.func_set_natvie(DataTransferItem);
window.DataTransferItemList = function() {}
;trashvm.func_set_natvie(DataTransferItemList);
window.DataView = function() {}
;trashvm.func_set_natvie(DataView);
window.DecompressionStream = function() {}
;trashvm.func_set_natvie(DecompressionStream);
window.DelayNode = function() {}
;trashvm.func_set_natvie(DelayNode);
window.DelegatedInkTrailPresenter = function() {}
;trashvm.func_set_natvie(DelegatedInkTrailPresenter);
window.DeviceMotionEvent = function() {}
;trashvm.func_set_natvie(DeviceMotionEvent);
window.DeviceMotionEventAcceleration = function() {}
;trashvm.func_set_natvie(DeviceMotionEventAcceleration);
window.DeviceMotionEventRotationRate = function() {}
;trashvm.func_set_natvie(DeviceMotionEventRotationRate);
window.DeviceOrientationEvent = function() {}
;trashvm.func_set_natvie(DeviceOrientationEvent);
window.DocumentFragment = function() {}
;trashvm.func_set_natvie(DocumentFragment);
window.DragEvent = function() {}
;trashvm.func_set_natvie(DragEvent);
window.DynamicsCompressorNode = function() {}
;trashvm.func_set_natvie(DynamicsCompressorNode);
window.ElementInternals = function() {}
;trashvm.func_set_natvie(ElementInternals);
window.EncodedAudioChunk = function() {}
;trashvm.func_set_natvie(EncodedAudioChunk);
window.ErrorEvent = function() {}
;trashvm.func_set_natvie(ErrorEvent);
window.EventCounts = function() {}
;trashvm.func_set_natvie(EventCounts);
window.EventSource = function() {}
;trashvm.func_set_natvie(EventSource);
window.External = function() {}
;trashvm.func_set_natvie(External);
window.EyeDropper = function() {}
;trashvm.func_set_natvie(EyeDropper);
window.FeaturePolicy = function() {}
;trashvm.func_set_natvie(FeaturePolicy);
window.FederatedCredential = function() {}
;trashvm.func_set_natvie(FederatedCredential);
window.File = function() {}
;trashvm.func_set_natvie(File);
window.FileList = function() {}
;trashvm.func_set_natvie(FileList);
window.FileReader = function() {}
;trashvm.func_set_natvie(FileReader);
window.FileSystemDirectoryHandle = function() {}
;trashvm.func_set_natvie(FileSystemDirectoryHandle);
window.FileSystemFileHandle = function() {}
;trashvm.func_set_natvie(FileSystemFileHandle);
window.FileSystemHandle = function() {}
;trashvm.func_set_natvie(FileSystemHandle);
window.FileSystemWritableFileStream = function() {}
;trashvm.func_set_natvie(FileSystemWritableFileStream);
window.FinalizationRegistry = function() {}
;trashvm.func_set_natvie(FinalizationRegistry);
window.FontFace = function() {}
;trashvm.func_set_natvie(FontFace);
window.FontFaceSetLoadEvent = function() {}
;trashvm.func_set_natvie(FontFaceSetLoadEvent);
window.FormData = function() {}
;trashvm.func_set_natvie(FormData);
window.FragmentDirective = function() {}
;trashvm.func_set_natvie(FragmentDirective);
window.FormDataEvent = function() {}
;trashvm.func_set_natvie(FormDataEvent);
window.Gamepad = function() {}
;trashvm.func_set_natvie(Gamepad);
window.GamepadButton = function() {}
;trashvm.func_set_natvie(GamepadButton);
window.GamepadEvent = function() {}
;trashvm.func_set_natvie(GamepadEvent);
window.GamepadHapticActuator = function() {}
;trashvm.func_set_natvie(GamepadHapticActuator);
window.Geolocation = function() {}
;trashvm.func_set_natvie(Geolocation);
window.GeolocationCoordinates = function() {}
;trashvm.func_set_natvie(GeolocationCoordinates);
window.GeolocationPosition = function() {}
;trashvm.func_set_natvie(GeolocationPosition);
window.GeolocationPositionError = function() {}
;trashvm.func_set_natvie(GeolocationPositionError);
window.GravitySensor = function() {}
;trashvm.func_set_natvie(GravitySensor);
window.Gyroscope = function() {}
;trashvm.func_set_natvie(Gyroscope);
window.HID = function() {}
;trashvm.func_set_natvie(HID);
window.HIDConnectionEvent = function() {}
;trashvm.func_set_natvie(HIDConnectionEvent);
window.HIDDevice = function() {}
;trashvm.func_set_natvie(HIDDevice);
window.HIDInputReportEvent = function() {}
;trashvm.func_set_natvie(HIDInputReportEvent);
window.HTMLAllCollection = function() {}
;trashvm.func_set_natvie(HTMLAllCollection);
window.HTMLAnchorElement = function() {}
;trashvm.func_set_natvie(HTMLAnchorElement);
window.HTMLAreaElement = function() {}
;trashvm.func_set_natvie(HTMLAreaElement);
window.HTMLAudioElement = function() {}
;trashvm.func_set_natvie(HTMLAudioElement);
window.HTMLBRElement = function() {}
;trashvm.func_set_natvie(HTMLBRElement);
window.HTMLBaseElement = function() {}
;trashvm.func_set_natvie(HTMLBaseElement);
window.HTMLBodyElement = function() {}
;trashvm.func_set_natvie(HTMLBodyElement);
window.HTMLButtonElement = function() {}
;trashvm.func_set_natvie(HTMLButtonElement);
window.HTMLCanvasElement = function() {}
;trashvm.func_set_natvie(HTMLCanvasElement);
window.HTMLCollection = function() {}
;trashvm.func_set_natvie(HTMLCollection);
window.HTMLDListElement = function() {}
;trashvm.func_set_natvie(HTMLDListElement);
window.HTMLDataElement = function() {}
;trashvm.func_set_natvie(HTMLDataElement);
window.HTMLDataListElement = function() {}
;trashvm.func_set_natvie(HTMLDataListElement);
window.HTMLDetailsElement = function() {}
;trashvm.func_set_natvie(HTMLDetailsElement);
window.HTMLDialogElement = function() {}
;trashvm.func_set_natvie(HTMLDialogElement);
window.HTMLDirectoryElement = function() {}
;trashvm.func_set_natvie(HTMLDirectoryElement);
window.HTMLDivElement = function() {}
;trashvm.func_set_natvie(HTMLDivElement);
window.HTMLDocument = function() {}
;trashvm.func_set_natvie(HTMLDocument);
window.HTMLElement = function() {}
;trashvm.func_set_natvie(HTMLElement);
window.HTMLEmbedElement = function() {}
;trashvm.func_set_natvie(HTMLEmbedElement);
window.HTMLFieldSetElement = function() {}
;trashvm.func_set_natvie(HTMLFieldSetElement);
window.HTMLFontElement = function() {}
;trashvm.func_set_natvie(HTMLFontElement);
window.HTMLFormControlsCollection = function() {}
;trashvm.func_set_natvie(HTMLFormControlsCollection);
window.HTMLFormElement = function() {}
;trashvm.func_set_natvie(HTMLFormElement);
window.HTMLFrameElement = function() {}
;trashvm.func_set_natvie(HTMLFrameElement);
window.HTMLFrameSetElement = function() {}
;trashvm.func_set_natvie(HTMLFrameSetElement);
window.HTMLHRElement = function() {}
;trashvm.func_set_natvie(HTMLHRElement);
window.HTMLHeadElement = function() {}
;trashvm.func_set_natvie(HTMLHeadElement);
window.HTMLHeadingElement = function() {}
;trashvm.func_set_natvie(HTMLHeadingElement);
window.HTMLHtmlElement = function() {}
;trashvm.func_set_natvie(HTMLHtmlElement);
window.HTMLIFrameElement = function() {}
;trashvm.func_set_natvie(HTMLIFrameElement);
window.HTMLImageElement = function() {}
;trashvm.func_set_natvie(HTMLImageElement);
window.HTMLInputElement = function() {}
;trashvm.func_set_natvie(HTMLInputElement);
window.HTMLMediaElement = function() {}
;trashvm.func_set_natvie(HTMLMediaElement);
window.HTMLLabelElement = function() {}
;trashvm.func_set_natvie(HTMLLabelElement);
window.HTMLLegendElement = function() {}
;trashvm.func_set_natvie(HTMLLegendElement);
window.HTMLLinkElement = function() {}
;trashvm.func_set_natvie(HTMLLinkElement);
window.HTMLMapElement = function() {}
;trashvm.func_set_natvie(HTMLMapElement);
window.HTMLMarqueeElement = function() {}
;trashvm.func_set_natvie(HTMLMarqueeElement);
window.HTMLMenuElement = function() {}
;trashvm.func_set_natvie(HTMLMenuElement);
window.HTMLMetaElement = function() {}
;trashvm.func_set_natvie(HTMLMetaElement);
window.HTMLMeterElement = function() {}
;trashvm.func_set_natvie(HTMLMeterElement);
window.HTMLModElement = function() {}
;trashvm.func_set_natvie(HTMLModElement);
window.HTMLOListElement = function() {}
;trashvm.func_set_natvie(HTMLOListElement);
window.HTMLObjectElement = function() {}
;trashvm.func_set_natvie(HTMLObjectElement);
window.HTMLOptGroupElement = function() {}
;trashvm.func_set_natvie(HTMLOptGroupElement);
window.HTMLOptionElement = function() {}
;trashvm.func_set_natvie(HTMLOptionElement);
window.HTMLOptionsCollection = function() {}
;trashvm.func_set_natvie(HTMLOptionsCollection);
window.HTMLOutputElement = function() {}
;trashvm.func_set_natvie(HTMLOutputElement);
window.HTMLParagraphElement = function() {}
;trashvm.func_set_natvie(HTMLParagraphElement);
window.HTMLParamElement = function() {}
;trashvm.func_set_natvie(HTMLParamElement);
window.HTMLPictureElement = function() {}
;trashvm.func_set_natvie(HTMLPictureElement);
window.HTMLPreElement = function() {}
;trashvm.func_set_natvie(HTMLPreElement);
window.HTMLQuoteElement = function() {}
;trashvm.func_set_natvie(HTMLQuoteElement);
window.HTMLScriptElement = function() {}
;trashvm.func_set_natvie(HTMLScriptElement);
window.HTMLSelectElement = function() {}
;trashvm.func_set_natvie(HTMLSelectElement);
window.HTMLSlotElement = function() {}
;trashvm.func_set_natvie(HTMLSlotElement);
window.HTMLSourceElement = function() {}
;trashvm.func_set_natvie(HTMLSourceElement);
window.HTMLSpanElement = function() {}
;trashvm.func_set_natvie(HTMLSpanElement);
window.HTMLStyleElement = function() {}
;trashvm.func_set_natvie(HTMLStyleElement);
window.HTMLTableCaptionElement = function() {}
;trashvm.func_set_natvie(HTMLTableCaptionElement);
window.HTMLTableCellElement = function() {}
;trashvm.func_set_natvie(HTMLTableCellElement);
window.HTMLTableColElement = function() {}
;trashvm.func_set_natvie(HTMLTableColElement);
window.HTMLTableElement = function() {}
;trashvm.func_set_natvie(HTMLTableElement);
window.HTMLTableRowElement = function() {}
;trashvm.func_set_natvie(HTMLTableRowElement);
window.HTMLTableSectionElement = function() {}
;trashvm.func_set_natvie(HTMLTableSectionElement);
window.HTMLTemplateElement = function() {}
;trashvm.func_set_natvie(HTMLTemplateElement);
window.HTMLTextAreaElement = function() {}
;trashvm.func_set_natvie(HTMLTextAreaElement);
window.HTMLTimeElement = function() {}
;trashvm.func_set_natvie(HTMLTimeElement);
window.HTMLTitleElement = function() {}
;trashvm.func_set_natvie(HTMLTitleElement);
window.HTMLTrackElement = function() {}
;trashvm.func_set_natvie(HTMLTrackElement);
window.HTMLUListElement = function() {}
;trashvm.func_set_natvie(HTMLUListElement);
window.HTMLUnknownElement = function() {}
;trashvm.func_set_natvie(HTMLUnknownElement);
window.HTMLVideoElement = function() {}
;trashvm.func_set_natvie(HTMLVideoElement);
window.HashChangeEvent = function() {}
;trashvm.func_set_natvie(HashChangeEvent);
window.Headers = function() {}
;trashvm.func_set_natvie(Headers);
window.IDBCursor = function() {}
;trashvm.func_set_natvie(IDBCursor);
window.IDBCursorWithValue = function() {}
;trashvm.func_set_natvie(IDBCursorWithValue);
window.IDBDatabase = function() {}
;trashvm.func_set_natvie(IDBDatabase);
window.IDBFactory = function() {}
;trashvm.func_set_natvie(IDBFactory);
window.IDBIndex = function() {}
;trashvm.func_set_natvie(IDBIndex);
window.IDBKeyRange = function() {}
;trashvm.func_set_natvie(IDBKeyRange);
window.IDBObjectStore = function() {}
;trashvm.func_set_natvie(IDBObjectStore);
window.IDBOpenDBRequest = function() {}
;trashvm.func_set_natvie(IDBOpenDBRequest);
window.IDBRequest = function() {}
;trashvm.func_set_natvie(IDBRequest);
window.IDBTransaction = function() {}
;trashvm.func_set_natvie(IDBTransaction);
window.IDBVersionChangeEvent = function() {}
;trashvm.func_set_natvie(IDBVersionChangeEvent);
window.IIRFilterNode = function() {}
;trashvm.func_set_natvie(IIRFilterNode);
window.IdleDeadline = function() {}
;trashvm.func_set_natvie(IdleDeadline);
window.IdleDetector = function() {}
;trashvm.func_set_natvie(IdleDetector);
window.ImageBitmap = function() {}
;trashvm.func_set_natvie(ImageBitmap);
window.ImageBitmapRenderingContext = function() {}
;trashvm.func_set_natvie(ImageBitmapRenderingContext);
window.ImageCapture = function() {}
;trashvm.func_set_natvie(ImageCapture);
window.ImageData = function() {}
;trashvm.func_set_natvie(ImageData);
window.ImageTrack = function() {}
;trashvm.func_set_natvie(ImageTrack);
window.ImageTrackList = function() {}
;trashvm.func_set_natvie(ImageTrackList);
window.Ink = function() {}
;trashvm.func_set_natvie(Ink);
window.InputDeviceCapabilities = function() {}
;trashvm.func_set_natvie(InputDeviceCapabilities);
window.InputDeviceInfo = function() {}
;trashvm.func_set_natvie(InputDeviceInfo);
window.InputEvent = function() {}
;trashvm.func_set_natvie(InputEvent);
window.IntersectionObserver = function() {}
;trashvm.func_set_natvie(IntersectionObserver);
window.IntersectionObserverEntry = function() {}
;trashvm.func_set_natvie(IntersectionObserverEntry);
window.Keyboard = function() {}
;trashvm.func_set_natvie(Keyboard);
window.KeyboardEvent = function() {}
;trashvm.func_set_natvie(KeyboardEvent);
window.KeyboardLayoutMap = function() {}
;trashvm.func_set_natvie(KeyboardLayoutMap);
window.KeyframeEffect = function() {}
;trashvm.func_set_natvie(KeyframeEffect);
window.LargestContentfulPaint = function() {}
;trashvm.func_set_natvie(LargestContentfulPaint);
window.LayoutShift = function() {}
;trashvm.func_set_natvie(LayoutShift);
window.LayoutShiftAttribution = function() {}
;trashvm.func_set_natvie(LayoutShiftAttribution);
window.LinearAccelerationSensor = function() {}
;trashvm.func_set_natvie(LinearAccelerationSensor);
window.Lock = function() {}
;trashvm.func_set_natvie(Lock);
window.LockManager = function() {}
;trashvm.func_set_natvie(LockManager);
window.MIDIAccess = function() {}
;trashvm.func_set_natvie(MIDIAccess);
window.MIDIConnectionEvent = function() {}
;trashvm.func_set_natvie(MIDIConnectionEvent);
window.MIDIInput = function() {}
;trashvm.func_set_natvie(MIDIInput);
window.MIDIInputMap = function() {}
;trashvm.func_set_natvie(MIDIInputMap);
window.MIDIMessageEvent = function() {}
;trashvm.func_set_natvie(MIDIMessageEvent);
window.MIDIOutputMap = function() {}
;trashvm.func_set_natvie(MIDIOutputMap);
window.MIDIOutput = function() {}
;trashvm.func_set_natvie(MIDIOutput);
window.MIDIOutputMap = function() {}
;trashvm.func_set_natvie(MIDIOutputMap);
window.MIDIPort = function() {}
;trashvm.func_set_natvie(MIDIPort);
window.MediaCapabilities = function() {}
;trashvm.func_set_natvie(MediaCapabilities);
window.MediaDeviceInfo = function() {}
;trashvm.func_set_natvie(MediaDeviceInfo);
window.MediaDevices = function() {}
;trashvm.func_set_natvie(MediaDevices);
window.MediaElementAudioSourceNode = function() {}
;trashvm.func_set_natvie(MediaElementAudioSourceNode);
window.MediaEncryptedEvent = function() {}
;trashvm.func_set_natvie(MediaEncryptedEvent);
window.MediaError = function() {}
;trashvm.func_set_natvie(MediaError);
window.MediaKeyMessageEvent = function() {}
;trashvm.func_set_natvie(MediaKeyMessageEvent);
window.MediaKeySession = function() {}
;trashvm.func_set_natvie(MediaKeySession);
window.MediaKeyStatusMap = function() {}
;trashvm.func_set_natvie(MediaKeyStatusMap);
window.MediaKeySystemAccess = function() {}
;trashvm.func_set_natvie(MediaKeySystemAccess);
window.MediaKeys = function() {}
;trashvm.func_set_natvie(MediaKeys);
window.MediaList = function() {}
;trashvm.func_set_natvie(MediaList);
window.MediaMetadata = function() {}
;trashvm.func_set_natvie(MediaMetadata);
window.MediaQueryList = function() {}
;trashvm.func_set_natvie(MediaQueryList);
window.MediaQueryListEvent = function() {}
;trashvm.func_set_natvie(MediaQueryListEvent);
window.MediaRecorder = function() {}
;trashvm.func_set_natvie(MediaRecorder);
window.MediaSession = function() {}
;trashvm.func_set_natvie(MediaSession);
window.MediaStream = function() {}
;trashvm.func_set_natvie(MediaStream);
window.MediaStreamAudioDestinationNode = function() {}
;trashvm.func_set_natvie(MediaStreamAudioDestinationNode);
window.MediaStreamAudioSourceNode = function() {}
;trashvm.func_set_natvie(MediaStreamAudioSourceNode);
window.MediaStreamEvent = function() {}
;trashvm.func_set_natvie(MediaStreamEvent);
window.MediaStreamTrack = function() {}
;trashvm.func_set_natvie(MediaStreamTrack);
window.MediaStreamTrackEvent = function() {}
;trashvm.func_set_natvie(MediaStreamTrackEvent);
window.MediaStreamTrackGenerator = function() {}
;trashvm.func_set_natvie(MediaStreamTrackGenerator);
window.MediaStreamTrackProcessor = function() {}
;trashvm.func_set_natvie(MediaStreamTrackProcessor);
window.stop = function stop() {}
;trashvm.func_set_natvie(stop);
window.scrollTo = function scrollTo() {}
;trashvm.func_set_natvie(scrollTo);
window.scrollBy = function scrollBy() {}
;trashvm.func_set_natvie(scrollBy);
window.scroll = function scroll() {}
;trashvm.func_set_natvie(scroll);
window.resizeTo = function () {}
;trashvm.func_set_natvie(resizeTo);
window.resizeBy = function resizeBy() {}
;trashvm.func_set_natvie(resizeBy);
window.requestIdleCallback = function requestIdleCallback() {}
;trashvm.func_set_natvie(requestIdleCallback);
window.requestAnimationFrame = function requestAnimationFrame() {}
;trashvm.func_set_natvie(requestAnimationFrame);
window.reportError = function reportError() {}
;trashvm.func_set_natvie(reportError);

window.queueMicrotask = function queueMicrotask() {}
;trashvm.func_set_natvie(queueMicrotask);
window.prompt = function prompt() {}
;trashvm.func_set_natvie(prompt);
window.print = function() {}
;trashvm.func_set_natvie(print);
window.postMessage = function postMessage(data) {
     port2.postMessage(data)
}
;trashvm.func_set_natvie(postMessage);
window.open = function open() {}
;trashvm.func_set_natvie(open);
window.moveTo = function moveTo() {}
;trashvm.func_set_natvie(moveTo);
window.moveBy = function moveBy() {}
;trashvm.func_set_natvie(moveBy);
window.matchMedia = function matchMedia() {}
;trashvm.func_set_natvie(matchMedia);
window.getSelection = function getSelection() {}
;trashvm.func_set_natvie(getSelection);
window.focus = function focus() {}
;trashvm.func_set_natvie(focus);
window.find = function find() {}
;trashvm.func_set_natvie(find);
window.fetch = function fetch() {}
;trashvm.func_set_natvie(fetch);
window.createImageBitmap = function createImageBitmap() {}
;trashvm.func_set_natvie(createImageBitmap);
window.confirm = function confirm() {}
;trashvm.func_set_natvie(confirm);
window.close = function close() {}
;trashvm.func_set_natvie(close);
window.captureEvents = function captureEvents() {}
;trashvm.func_set_natvie(captureEvents);
window.MessageChannel = function() {}
;trashvm.func_set_natvie(MessageChannel);
window.MessageEvent = function() {}
;trashvm.func_set_natvie(MessageEvent);
window.MessagePort = function() {}
;trashvm.func_set_natvie(MessagePort);
window.MimeType = function() {}
;trashvm.func_set_natvie(MimeType);
window.MimeTypeArray = function() {}
;trashvm.func_set_natvie(MimeTypeArray);
window.MouseEvent = function() {}
;trashvm.func_set_natvie(MouseEvent);
window.MutationEvent = function() {}
;trashvm.func_set_natvie(MutationEvent);
window.MutationObserver = function() {
    return {
        observe:function(){}
    }
}
;trashvm.func_set_natvie(MutationObserver);
window.MutationRecord = function() {}
;trashvm.func_set_natvie(MutationRecord);
window.NamedNodeMap = function() {}
;trashvm.func_set_natvie(NamedNodeMap);
window.NavigationPreloadManager = function() {}
;trashvm.func_set_natvie(NavigationPreloadManager);
window.NavigatorManagedData = function() {}
;trashvm.func_set_natvie(NavigatorManagedData);
NavigatorUAData = function() {}
;trashvm.func_set_natvie(NavigatorUAData);
window.NetworkInformation = function() {}
;trashvm.func_set_natvie(NetworkInformation);
window.NodeFilter = function() {}
;trashvm.func_set_natvie(NodeFilter);
window.NodeIterator = function() {}
;trashvm.func_set_natvie(NodeIterator);
window.Notification = function() {}
;trashvm.func_set_natvie(Notification);
window.OTPCredential = function() {}
;trashvm.func_set_natvie(OTPCredential);
window.OfflineAudioCompletionEvent = function() {}
;trashvm.func_set_natvie(OfflineAudioCompletionEvent);
window.OfflineAudioContext = function() {}
;trashvm.func_set_natvie(OfflineAudioContext);
window.OffscreenCanvas = function() {}
;trashvm.func_set_natvie(OffscreenCanvas);
window.OffscreenCanvasRenderingContext2D = function() {}
;trashvm.func_set_natvie(OffscreenCanvasRenderingContext2D);
window.OrientationSensor = function() {}
;trashvm.func_set_natvie(OrientationSensor);
window.OscillatorNode = function() {}
;trashvm.func_set_natvie(OscillatorNode);
window.OverconstrainedError = function() {}
;trashvm.func_set_natvie(OverconstrainedError);
window.PageTransitionEvent = function() {}
;trashvm.func_set_natvie(PageTransitionEvent);
window.PERSISTENT = function() {}
;trashvm.func_set_natvie(PERSISTENT);
window.PageTransitionEvent = function() {}
;trashvm.func_set_natvie(PageTransitionEvent);
window.PannerNode = function() {}
;trashvm.func_set_natvie(PannerNode);
window.PaymentAddress = function() {}
;trashvm.func_set_natvie(PaymentAddress);
window.Path2D = function() {}
;trashvm.func_set_natvie(Path2D);
window.PaymentAddress = function() {}
;trashvm.func_set_natvie(PaymentAddress);
window.PaymentInstruments = function() {}
;trashvm.func_set_natvie(PaymentInstruments);
window.PaymentManager = function() {}
;trashvm.func_set_natvie(PaymentManager);
window.PaymentMethodChangeEvent = function() {}
;trashvm.func_set_natvie(PaymentMethodChangeEvent);
window.PaymentRequest = function() {}
;trashvm.func_set_natvie(PaymentRequest);
window.PaymentRequestUpdateEvent = function() {}
;trashvm.func_set_natvie(PaymentRequestUpdateEvent);
window.PaymentResponse = function() {}
;trashvm.func_set_natvie(PaymentResponse);

window.PerformanceElementTiming = function() {}
;trashvm.func_set_natvie(PerformanceElementTiming);
window.PerformanceEntry = function() {}
;trashvm.func_set_natvie(PerformanceEntry);
window.PerformanceEventTiming = function() {}
;trashvm.func_set_natvie(PerformanceEventTiming);
window.PerformanceLongTaskTiming = function() {}
;trashvm.func_set_natvie(PerformanceLongTaskTiming);
window.PerformanceMark = function() {}
;trashvm.func_set_natvie(PerformanceMark);
window.PerformanceMeasure = function() {}
;trashvm.func_set_natvie(PerformanceMeasure);
window.PerformanceNavigation = function() {}
;trashvm.func_set_natvie(PerformanceNavigation);
window.PerformanceNavigationTiming = function() {}
;trashvm.func_set_natvie(PerformanceNavigationTiming);
window.PerformanceObserver = function() {}
;trashvm.func_set_natvie(PerformanceObserver);
window.PerformanceObserverEntryList = function() {}
;trashvm.func_set_natvie(PerformanceObserverEntryList);
window.PerformancePaintTiming = function() {}
;trashvm.func_set_natvie(PerformancePaintTiming);
window.PerformanceResourceTiming = function() {}
;trashvm.func_set_natvie(PerformanceResourceTiming);
window.PerformanceServerTiming = function() {}
;trashvm.func_set_natvie(PerformanceServerTiming);
window.PerformanceTiming = function() {}
;trashvm.func_set_natvie(PerformanceTiming);
window.PeriodicSyncManager = function() {}
;trashvm.func_set_natvie(PeriodicSyncManager);
window.PeriodicWave = function() {}
;trashvm.func_set_natvie(PeriodicWave);
window.PermissionStatus = function() {}
;trashvm.func_set_natvie(PermissionStatus);
window.Permissions = function() {}
;trashvm.func_set_natvie(Permissions);
window.PictureInPictureEvent = function() {}
;trashvm.func_set_natvie(PictureInPictureEvent);
window.PictureInPictureWindow = function() {}
;trashvm.func_set_natvie(PictureInPictureWindow);
window.PluginArray = function() {}
;trashvm.func_set_natvie(PluginArray);
window.PointerEvent = function() {}
;trashvm.func_set_natvie(PointerEvent);
window.PopStateEvent = function() {}
;trashvm.func_set_natvie(PopStateEvent);
window.Presentation = function() {}
;trashvm.func_set_natvie(Presentation);
window.PresentationAvailability = function() {}
;trashvm.func_set_natvie(PresentationAvailability);
window.PresentationConnection = function() {}
;trashvm.func_set_natvie(PresentationConnection);
window.PresentationConnectionAvailableEvent = function() {}
;trashvm.func_set_natvie(PresentationConnectionAvailableEvent);
window.PresentationConnectionCloseEvent = function() {}
;trashvm.func_set_natvie(PresentationConnectionCloseEvent);
window.PresentationConnectionList = function() {}
;trashvm.func_set_natvie(PresentationConnectionList);
window.PresentationReceiver = function() {}
;trashvm.func_set_natvie(PresentationReceiver);
window.PresentationRequest = function() {}
;trashvm.func_set_natvie(PresentationRequest);
window.ProcessingInstruction = function() {}
;trashvm.func_set_natvie(ProcessingInstruction);
window.Profiler = function() {}
;trashvm.func_set_natvie(Profiler);
window.ProgressEvent = function() {}
;trashvm.func_set_natvie(ProgressEvent);
window.PromiseRejectionEvent = function() {}
;trashvm.func_set_natvie(PromiseRejectionEvent);
window.PublicKeyCredential = function() {}
;trashvm.func_set_natvie(PublicKeyCredential);
window.PushManager = function() {}
;trashvm.func_set_natvie(PushManager);
window.PushSubscription = function() {}
;trashvm.func_set_natvie(PushSubscription);
window.PushSubscriptionOptions = function() {}
;trashvm.func_set_natvie(PushSubscriptionOptions);
window.RTCCertificate = function() {}
;trashvm.func_set_natvie(RTCCertificate);
window.RTCDTMFSender = function() {}
;trashvm.func_set_natvie(RTCDTMFSender);
window.RTCDTMFToneChangeEvent = function() {}
;trashvm.func_set_natvie(RTCDTMFToneChangeEvent);
window.RTCDataChannel = function() {}
;trashvm.func_set_natvie(RTCDataChannel);
window.RTCDataChannelEvent = function() {}
;trashvm.func_set_natvie(RTCDataChannelEvent);
window.RTCDtlsTransport = function() {}
;trashvm.func_set_natvie(RTCDtlsTransport);
window.RTCEncodedAudioFrame = function() {}
;trashvm.func_set_natvie(RTCEncodedAudioFrame);
window.RTCEncodedVideoFrame = function() {}
;trashvm.func_set_natvie(RTCEncodedVideoFrame);
window.RTCError = function() {}
;trashvm.func_set_natvie(RTCError);
window.RTCErrorEvent = function() {}
;trashvm.func_set_natvie(RTCErrorEvent);
window.RTCIceCandidate = function() {}
;trashvm.func_set_natvie(RTCIceCandidate);
window.RTCIceTransport = function() {}
;trashvm.func_set_natvie(RTCIceTransport);
window.RTCPeerConnection = function() {}
;trashvm.func_set_natvie(RTCPeerConnection);
window.RTCPeerConnectionIceErrorEvent = function() {}
;trashvm.func_set_natvie(RTCPeerConnectionIceErrorEvent);
window.RTCPeerConnectionIceEvent = function() {}
;trashvm.func_set_natvie(RTCPeerConnectionIceEvent);
window.RTCRtpReceiver = function() {}
;trashvm.func_set_natvie(RTCRtpReceiver);
window.RTCRtpSender = function() {}
;trashvm.func_set_natvie(RTCRtpSender);
window.RTCRtpTransceiver = function() {}
;trashvm.func_set_natvie(RTCRtpTransceiver);
window.RTCSctpTransport = function() {}
;trashvm.func_set_natvie(RTCSctpTransport);
window.RTCSessionDescription = function() {}
;trashvm.func_set_natvie(RTCSessionDescription);
window.RTCStatsReport = function() {}
;trashvm.func_set_natvie(RTCStatsReport);
RTCTrackEvent = function() {}
;trashvm.func_set_natvie(RTCTrackEvent);
window.RadioNodeList = function() {}
;trashvm.func_set_natvie(RadioNodeList);
window.Range = function() {}
;trashvm.func_set_natvie(Range);
window.RangeError = function() {}
;trashvm.func_set_natvie(RangeError);
window.ReadableByteStreamController = function() {}
;trashvm.func_set_natvie(ReadableByteStreamController);
window.ReadableStream = function() {}
;trashvm.func_set_natvie(ReadableStream);
window.ReadableStreamBYOBReader = function() {}
;trashvm.func_set_natvie(ReadableStreamBYOBReader);
window.ReadableStreamBYOBRequest = function() {}
;trashvm.func_set_natvie(ReadableStreamBYOBRequest);
window.ReadableStreamDefaultController = function() {}
;trashvm.func_set_natvie(ReadableStreamDefaultController);
window.ReadableStreamDefaultReader = function() {}
;trashvm.func_set_natvie(ReadableStreamDefaultReader);
window.RelativeOrientationSensor = function() {}
;trashvm.func_set_natvie(RelativeOrientationSensor);
window.RemotePlayback = function() {}
;trashvm.func_set_natvie(RemotePlayback);
window.ReportingObserver = function() {}
;trashvm.func_set_natvie(ReportingObserver);
window.Request = function() {}
;trashvm.func_set_natvie(Request);
window.ResizeObserver = function() {}
;trashvm.func_set_natvie(ResizeObserver);
window.ResizeObserverEntry = function() {}
;trashvm.func_set_natvie(ResizeObserverEntry);
window.ResizeObserverSize = function() {}
;trashvm.func_set_natvie(ResizeObserverSize);
window.Response = function() {}
;trashvm.func_set_natvie(Response);
window.SVGAElement = function() {}
;trashvm.func_set_natvie(SVGAElement);
window.SVGAngle = function() {}
;trashvm.func_set_natvie(SVGAngle);
window.SVGAnimateElement = function() {}
;trashvm.func_set_natvie(SVGAnimateElement);
window.SVGAnimateMotionElement = function() {}
;trashvm.func_set_natvie(SVGAnimateMotionElement);
window.SVGAnimateTransformElement = function() {}
;trashvm.func_set_natvie(SVGAnimateTransformElement);
window.SVGAnimatedAngle = function() {}
;trashvm.func_set_natvie(SVGAnimatedAngle);
window.SVGAnimatedBoolean = function() {}
;trashvm.func_set_natvie(SVGAnimatedBoolean);
window.SVGAnimatedEnumeration = function() {}
;trashvm.func_set_natvie(SVGAnimatedEnumeration);
window.SVGAnimatedInteger = function() {}
;trashvm.func_set_natvie(SVGAnimatedInteger);
window.SVGAnimatedLength = function() {}
;trashvm.func_set_natvie(SVGAnimatedLength);
window.SVGAnimatedLengthList = function() {}
;trashvm.func_set_natvie(SVGAnimatedLengthList);
window.SVGAnimatedNumber = function() {}
;trashvm.func_set_natvie(SVGAnimatedNumber);
window.SVGAnimatedNumberList = function() {}
;trashvm.func_set_natvie(SVGAnimatedNumberList);
window.SVGAnimatedPreserveAspectRatio = function() {}
;trashvm.func_set_natvie(SVGAnimatedPreserveAspectRatio);
window.SVGAnimatedRect = function() {}
;trashvm.func_set_natvie(SVGAnimatedRect);
window.SVGAnimatedString = function() {}
;trashvm.func_set_natvie(SVGAnimatedString);
window.SVGAnimatedTransformList = function() {}
;trashvm.func_set_natvie(SVGAnimatedTransformList);
window.SVGAnimationElement = function() {}
;trashvm.func_set_natvie(SVGAnimationElement);
window.SVGCircleElement = function() {}
;trashvm.func_set_natvie(SVGCircleElement);
window.SVGClipPathElement = function() {}
;trashvm.func_set_natvie(SVGClipPathElement);
window.SVGComponentTransferFunctionElement = function() {}
;trashvm.func_set_natvie(SVGComponentTransferFunctionElement);
window.SVGDefsElement = function() {}
;trashvm.func_set_natvie(SVGDefsElement);
window.SVGDescElement = function() {}
;trashvm.func_set_natvie(SVGDescElement);
window.SVGEllipseElement = function() {}
;trashvm.func_set_natvie(SVGEllipseElement);
window.SVGFEBlendElement = function() {}
;trashvm.func_set_natvie(SVGFEBlendElement);
window.SVGFEColorMatrixElement = function() {}
;trashvm.func_set_natvie(SVGFEColorMatrixElement);
window.SVGFEComponentTransferElement = function() {}
;trashvm.func_set_natvie(SVGFEComponentTransferElement);
window.SVGFECompositeElement = function() {}
;trashvm.func_set_natvie(SVGFECompositeElement);
window.SVGFEConvolveMatrixElement = function() {}
;trashvm.func_set_natvie(SVGFEConvolveMatrixElement);
window.SVGFEDiffuseLightingElement = function() {}
;trashvm.func_set_natvie(SVGFEDiffuseLightingElement);
window.SVGFEDisplacementMapElement = function() {}
;trashvm.func_set_natvie(SVGFEDisplacementMapElement);
window.SVGFEDistantLightElement = function() {}
;trashvm.func_set_natvie(SVGFEDistantLightElement);
window.SVGFEDropShadowElement = function() {}
;trashvm.func_set_natvie(SVGFEDropShadowElement);
window.SVGFEFloodElement = function() {}
;trashvm.func_set_natvie(SVGFEFloodElement);
window.SVGFEFuncAElement = function() {}
;trashvm.func_set_natvie(SVGFEFuncAElement);
window.SVGFEFuncBElement = function() {}
;trashvm.func_set_natvie(SVGFEFuncBElement);
window.SVGFEFuncGElement = function() {}
;trashvm.func_set_natvie(SVGFEFuncGElement);
window.SVGFEFuncRElement = function() {}
;trashvm.func_set_natvie(SVGFEFuncRElement);
window.SVGFEGaussianBlurElement = function() {}
;trashvm.func_set_natvie(SVGFEGaussianBlurElement);
window.SVGFEImageElement = function() {}
;trashvm.func_set_natvie(SVGFEImageElement);
window.SVGFEMergeElement = function() {}
;trashvm.func_set_natvie(SVGFEMergeElement);
window.SVGFEMergeNodeElement = function() {}
;trashvm.func_set_natvie(SVGFEMergeNodeElement);
window.SVGFEMorphologyElement = function() {}
;trashvm.func_set_natvie(SVGFEMorphologyElement);
window.SVGFEOffsetElement = function() {}
;trashvm.func_set_natvie(SVGFEOffsetElement);
window.SVGFEPointLightElement = function() {}
;trashvm.func_set_natvie(SVGFEPointLightElement);
window.SVGFESpecularLightingElement = function() {}
;trashvm.func_set_natvie(SVGFESpecularLightingElement);
window.SVGFESpotLightElement = function() {}
;trashvm.func_set_natvie(SVGFESpotLightElement);
window.SVGFETileElement = function() {}
;trashvm.func_set_natvie(SVGFETileElement);
window.SVGFETurbulenceElement = function() {}
;trashvm.func_set_natvie(SVGFETurbulenceElement);
window.SVGFilterElement = function() {}
;trashvm.func_set_natvie(SVGFilterElement);
window.SVGForeignObjectElement = function() {}
;trashvm.func_set_natvie(SVGForeignObjectElement);
window.SVGGeometryElement = function() {}
;trashvm.func_set_natvie(SVGGeometryElement);
window.SVGGradientElement = function() {}
;trashvm.func_set_natvie(SVGGradientElement);
window.SVGGraphicsElement = function() {}
;trashvm.func_set_natvie(SVGGraphicsElement);
window.SVGImageElement = function() {}
;trashvm.func_set_natvie(SVGImageElement);
window.SVGLength = function() {}
;trashvm.func_set_natvie(SVGLength);
window.SVGLengthList = function() {}
;trashvm.func_set_natvie(SVGLengthList);
window.SVGLineElement = function() {}
;trashvm.func_set_natvie(SVGLineElement);
window.SVGLinearGradientElement = function() {}
;trashvm.func_set_natvie(SVGLinearGradientElement);
window.SVGMPathElement = function() {}
;trashvm.func_set_natvie(SVGMPathElement);
window.SVGMarkerElement = function() {}
;trashvm.func_set_natvie(SVGMarkerElement);
window.SVGMaskElement = function() {}
;trashvm.func_set_natvie(SVGMaskElement);
window.SVGMatrix = function() {}
;trashvm.func_set_natvie(SVGMatrix);
window.SVGMetadataElement = function() {}
;trashvm.func_set_natvie(SVGMetadataElement);
window.SVGNumber = function() {}
;trashvm.func_set_natvie(SVGNumber);
window.SVGNumberList = function() {}
;trashvm.func_set_natvie(SVGNumberList);
window.SVGPathElement = function() {}
;trashvm.func_set_natvie(SVGPathElement);
window.SVGPatternElement = function() {}
;trashvm.func_set_natvie(SVGPatternElement);
window.SVGPoint = function() {}
;trashvm.func_set_natvie(SVGPoint);
window.SVGPointList = function() {}
;trashvm.func_set_natvie(SVGPointList);
window.SVGPolygonElement = function() {}
;trashvm.func_set_natvie(SVGPolygonElement);

window.SVGPolylineElement = function() {}
;trashvm.func_set_natvie(SVGPolylineElement);
window.SVGPreserveAspectRatio = function() {}
;trashvm.func_set_natvie(SVGPreserveAspectRatio);
window.SVGRadialGradientElement = function() {}
;trashvm.func_set_natvie(SVGRadialGradientElement);
window.SVGRect = function() {}
;trashvm.func_set_natvie(SVGRect);
window.SVGRectElement = function() {}
;trashvm.func_set_natvie(SVGRectElement);
window.SVGSVGElement = function() {}
;trashvm.func_set_natvie(SVGSVGElement);
window.SVGScriptElement = function() {}
;trashvm.func_set_natvie(SVGScriptElement);
window.SVGSetElement = function() {}
;trashvm.func_set_natvie(SVGSetElement);
window.SVGStopElement = function() {}
;trashvm.func_set_natvie(SVGStopElement);
window.SVGStringList = function() {}
;trashvm.func_set_natvie(SVGStringList);
window.SVGStyleElement = function() {}
;trashvm.func_set_natvie(SVGStyleElement);
window.SVGSwitchElement = function() {}
;trashvm.func_set_natvie(SVGSwitchElement);
window.SVGSymbolElement = function() {}
;trashvm.func_set_natvie(SVGSymbolElement);
window.SVGTSpanElement = function() {}
;trashvm.func_set_natvie(SVGTSpanElement);
window.SVGTextContentElement = function() {}
;trashvm.func_set_natvie(SVGTextContentElement);
window.SVGTextElement = function() {}
;trashvm.func_set_natvie(SVGTextElement);
window.SVGTextPathElement = function() {}
;trashvm.func_set_natvie(SVGTextPathElement);
window.SVGTextPositioningElement = function() {}
;trashvm.func_set_natvie(SVGTextPositioningElement);
window.SVGTitleElement = function() {}
;trashvm.func_set_natvie(SVGTitleElement);
window.SVGTransform = function() {}
;trashvm.func_set_natvie(SVGTransform);
window.SVGTransformList = function() {}
;trashvm.func_set_natvie(SVGTransformList);
window.SVGUnitTypes = function() {}
;trashvm.func_set_natvie(SVGUnitTypes);
window.Scheduling = function() {}
;trashvm.func_set_natvie(Scheduling);
window.SVGUseElement = function() {}
;trashvm.func_set_natvie(SVGUseElement);

window.Scheduler = function(){};trashvm.func_set_natvie(Scheduler);
window.speechSynthesis = {};
caches ={};
window.ScreenOrientation = function() {}
;trashvm.func_set_natvie(ScreenOrientation);
window.ScriptProcessorNode = function() {}
;trashvm.func_set_natvie(ScriptProcessorNode);
window.SecurityPolicyViolationEvent = function() {}
;trashvm.func_set_natvie(SecurityPolicyViolationEvent);
window.Selection = function() {}
;trashvm.func_set_natvie(Selection);
window.Sensor = function() {}
;trashvm.func_set_natvie(Sensor);
window.SensorErrorEvent = function() {}
;trashvm.func_set_natvie(SensorErrorEvent);
window.Serial = function() {}
;trashvm.func_set_natvie(Serial);
window.SerialPort = function() {}
;trashvm.func_set_natvie(SerialPort);
window.ServiceWorker = function() {}
;trashvm.func_set_natvie(ServiceWorker);
window.ServiceWorkerContainer = function() {}
;trashvm.func_set_natvie(ServiceWorkerContainer);
window.ServiceWorkerRegistration = function() {}
;trashvm.func_set_natvie(ServiceWorkerRegistration);
window.ShadowRoot = function() {}
;trashvm.func_set_natvie(ShadowRoot);
window.SharedWorker = function() {}
;trashvm.func_set_natvie(SharedWorker);
window.SourceBuffer = function() {}
;trashvm.func_set_natvie(SourceBuffer);
window.SourceBufferList = function() {}
;trashvm.func_set_natvie(SourceBufferList);
window.SpeechSynthesisErrorEvent = function() {}
;trashvm.func_set_natvie(SpeechSynthesisErrorEvent);
window.SpeechSynthesisEvent = function() {}
;trashvm.func_set_natvie(SpeechSynthesisEvent);
window.SpeechSynthesisUtterance = function() {}
;trashvm.func_set_natvie(SpeechSynthesisUtterance);
window.StaticRange = function() {}
;trashvm.func_set_natvie(StaticRange);
window.StereoPannerNode = function() {}
;trashvm.func_set_natvie(StereoPannerNode);
window.StorageEvent = function() {}
;trashvm.func_set_natvie(StorageEvent);
window.StorageManager = function() {}
;trashvm.func_set_natvie(StorageManager);
window.StylePropertyMap = function() {}
;trashvm.func_set_natvie(StylePropertyMap);

window.StylePropertyMapReadOnly = function() {}
;trashvm.func_set_natvie(StylePropertyMapReadOnly);
window.StyleSheet = function() {}
;trashvm.func_set_natvie(StyleSheet);
window.StyleSheetList = function() {}
;trashvm.func_set_natvie(StyleSheetList);
window.SubmitEvent = function() {}
;trashvm.func_set_natvie(SubmitEvent);
window.SubtleCrypto = function() {}
;trashvm.func_set_natvie(SubtleCrypto);
window.SyncManager = function() {}
;trashvm.func_set_natvie(SyncManager);
window.TEMPORARY = 0;
window.TaskAttributionTiming = function() {}
;trashvm.func_set_natvie(TaskAttributionTiming);
window.TaskController = function() {}
;trashvm.func_set_natvie(TaskController);
window.TaskPriorityChangeEvent = function() {}
;trashvm.func_set_natvie(TaskPriorityChangeEvent);
window.TaskSignal = function() {}
;trashvm.func_set_natvie(TaskSignal);
window.TextDecoderStream = function() {}
;trashvm.func_set_natvie(TextDecoderStream);
window.TextEncoder = function() {}
;trashvm.func_set_natvie(TextEncoder);
window.TextEncoderStream = function() {}
;trashvm.func_set_natvie(TextEncoderStream);
window.TextEvent = function() {}
;trashvm.func_set_natvie(TextEvent);
window.TextMetrics = function() {}
;trashvm.func_set_natvie(TextMetrics);
window.TextTrack = function() {}
;trashvm.func_set_natvie(TextTrack);
window.TextTrackCue = function() {}
;trashvm.func_set_natvie(TextTrackCue);
window.TextTrackCueList = function() {}
;trashvm.func_set_natvie(TextTrackCueList);
window.TextTrackList = function() {}
;trashvm.func_set_natvie(TextTrackList);
window.TimeRanges = function() {}
;trashvm.func_set_natvie(TimeRanges);
window.Touch = function() {}
;trashvm.func_set_natvie(Touch);
window.TouchEvent = function() {}
;trashvm.func_set_natvie(TouchEvent);
window.TouchList = function() {}
;trashvm.func_set_natvie(TouchList);
window.TouchList = function() {}
;trashvm.func_set_natvie(TouchList);
window.History = function History(){};
trashvm.func_set_natvie(History);
window.ImageDecoder = function ImageDecoder(){};
trashvm.func_set_natvie(ImageDecoder);
window.TrackEvent = function() {}
;trashvm.func_set_natvie(TrackEvent);
window.TransformStream = function() {}
;trashvm.func_set_natvie(TransformStream);
window.TransitionEvent = function() {}
;trashvm.func_set_natvie(TransitionEvent);
window.TreeWalker = function() {}
;trashvm.func_set_natvie(TreeWalker);
window.TrustedHTML = function() {}
;trashvm.func_set_natvie(TrustedHTML);
window.TrustedScriptURL = function() {}
;trashvm.func_set_natvie(TrustedScriptURL);
window.TrustedTypePolicy = function() {}
;trashvm.func_set_natvie(TrustedTypePolicy);
window.TrustedTypePolicyFactory = function() {}
;trashvm.func_set_natvie(TrustedTypePolicyFactory);
window.UIEvent = function() {}
;trashvm.func_set_natvie(UIEvent);
window.URLPattern = function() {}
;trashvm.func_set_natvie(URLPattern);
window.USB = function() {}
;trashvm.func_set_natvie(USB);
window.USBAlternateInterface = function() {}
;trashvm.func_set_natvie(USBAlternateInterface);
window.USBConfiguration = function() {}
;trashvm.func_set_natvie(USBConfiguration);
window.USBConnectionEvent = function() {}
;trashvm.func_set_natvie(USBConnectionEvent);
window.USBDevice = function() {}
;trashvm.func_set_natvie(USBDevice);
window.USBEndpoint = function() {}
;trashvm.func_set_natvie(USBEndpoint);
window.USBInTransferResult = function() {}
;trashvm.func_set_natvie(USBInTransferResult);
window.USBInterface = function() {}
;trashvm.func_set_natvie(USBInterface);
window.USBIsochronousInTransferPacket = function() {}
;trashvm.func_set_natvie(USBIsochronousInTransferPacket);
window.USBIsochronousInTransferResult = function() {}
;trashvm.func_set_natvie(USBIsochronousInTransferResult);
window.USBIsochronousOutTransferPacket = function() {}
;trashvm.func_set_natvie(USBIsochronousOutTransferPacket);
window.USBIsochronousOutTransferResult = function() {}
;trashvm.func_set_natvie(USBIsochronousOutTransferResult);
window.USBOutTransferResult = function() {}
;trashvm.func_set_natvie(USBOutTransferResult);
window.UserActivation = function() {}
;trashvm.func_set_natvie(UserActivation);
window.VTTCue = function() {}
;trashvm.func_set_natvie(VTTCue);
window.ValidityState = function() {}
;trashvm.func_set_natvie(ValidityState);
window.VideoColorSpace = function() {}
;trashvm.func_set_natvie(VideoColorSpace);
window.VideoDecoder = function() {}
;trashvm.func_set_natvie(VideoDecoder);
window.VideoEncoder = function() {}
;trashvm.func_set_natvie(VideoEncoder);
window.VideoFrame = function() {}
;trashvm.func_set_natvie(VideoFrame);
window.VideoPlaybackQuality = function() {}
;trashvm.func_set_natvie(VideoPlaybackQuality);
window.VirtualKeyboard = function() {}
;trashvm.func_set_natvie(VirtualKeyboard);
window.VirtualKeyboardGeometryChangeEvent = function() {}
;trashvm.func_set_natvie(VirtualKeyboardGeometryChangeEvent);

window.WakeLock = function() {}
;trashvm.func_set_natvie(WakeLock);
window.WakeLockSentinel = function() {}
;trashvm.func_set_natvie(WakeLockSentinel);
window.WaveShaperNode = function() {}
;trashvm.func_set_natvie(WaveShaperNode);
window.WeakMap = function() {}
;trashvm.func_set_natvie(WeakMap);
window.WeakRef = function() {}
;trashvm.func_set_natvie(WeakRef);
window.WeakSet = function() {}
;trashvm.func_set_natvie(WeakSet);

window.WebGL2RenderingContext = function() {}
;trashvm.func_set_natvie(WebGL2RenderingContext);
window.WebGLActiveInfo = function() {}
;trashvm.func_set_natvie(WebGLActiveInfo);
window.WebGLBuffer = function() {}
;trashvm.func_set_natvie(WebGLBuffer);
window.WebGLContextEvent = function() {}
;trashvm.func_set_natvie(WebGLContextEvent);
window.WebGLFramebuffer = function() {}
;trashvm.func_set_natvie(WebGLFramebuffer);
window.WebGLProgram = function() {}
;trashvm.func_set_natvie(WebGLProgram);
window.WebGLQuery = function() {}
;trashvm.func_set_natvie(WebGLQuery);
window.WebGLRenderbuffer = function() {}
;trashvm.func_set_natvie(WebGLRenderbuffer);
window.WebGLRenderingContext = function() {}
;trashvm.func_set_natvie(WebGLRenderingContext);
window.WebGLSampler = function() {}
;trashvm.func_set_natvie(WebGLSampler);
window.WebGLShader = function() {}
;trashvm.func_set_natvie(WebGLShader);
window.WebGLShaderPrecisionFormat = function() {}
;trashvm.func_set_natvie(WebGLShaderPrecisionFormat);
window.WebGLSync = function() {}
;trashvm.func_set_natvie(WebGLSync);
window.WebGLTexture = function() {}
;trashvm.func_set_natvie(WebGLTexture);
window.WebGLTransformFeedback = function() {}
;trashvm.func_set_natvie(WebGLTransformFeedback);
window.WebGLUniformLocation = function() {}
;trashvm.func_set_natvie(WebGLUniformLocation);
window.WebGLVertexArrayObject = function() {}
;trashvm.func_set_natvie(WebGLVertexArrayObject);
window.WebKitCSSMatrix = function() {}
;trashvm.func_set_natvie(WebKitCSSMatrix);
window.WebKitMutationObserver = function() {}
;trashvm.func_set_natvie(WebKitMutationObserver);

window.WebSocket = function() {}
;trashvm.func_set_natvie(WebSocket);




window.TouchList = function() {}
;trashvm.func_set_natvie(TouchList);
window.WheelEvent = function() {}
;trashvm.func_set_natvie(WheelEvent);
window.Worklet = function() {}
;trashvm.func_set_natvie(Worklet);
window.WritableStream = function() {}
;trashvm.func_set_natvie(WritableStream);
window.WritableStreamDefaultController = function() {}
;trashvm.func_set_natvie(WritableStreamDefaultController);
window.WritableStreamDefaultWriter = function() {}
;trashvm.func_set_natvie(WritableStreamDefaultWriter);
window.XMLSerializer = function() {}
;trashvm.func_set_natvie(XMLSerializer);
window.XPathEvaluator = function() {}
;trashvm.func_set_natvie(XPathEvaluator);
window.XPathExpression = function() {}
;trashvm.func_set_natvie(XPathExpression);
window.XPathResult = function() {}
;trashvm.func_set_natvie(XPathResult);
window.XRAnchor = function() {}
;trashvm.func_set_natvie(XRAnchor);
window.XRAnchorSet = function() {}
;trashvm.func_set_natvie(XRAnchorSet);
window.XRBoundedReferenceSpace = function() {}
;trashvm.func_set_natvie(XRBoundedReferenceSpace);
window.XRCPUDepthInformation = function() {}
;trashvm.func_set_natvie(XRCPUDepthInformation);
window.XRDOMOverlayState = function() {}
;trashvm.func_set_natvie(XRDOMOverlayState);
window.XRDepthInformation = function() {}
;trashvm.func_set_natvie(XRDepthInformation);
window.XRDepthInformation = function() {}
;trashvm.func_set_natvie(XRDepthInformation);
window.XRHitTestResult = function() {}
;trashvm.func_set_natvie(XRHitTestResult);
window.XRHitTestSource = function() {}
;trashvm.func_set_natvie(XRHitTestSource);
window.XRInputSource = function() {}
;trashvm.func_set_natvie(XRInputSource);
window.XRInputSourceArray = function() {}
;trashvm.func_set_natvie(XRInputSourceArray);
window.XRInputSourceEvent = function() {}
;trashvm.func_set_natvie(XRInputSourceEvent);
window.XRInputSourcesChangeEvent = function() {}
;trashvm.func_set_natvie(XRInputSourcesChangeEvent);
window.XRLayer = function() {}
;trashvm.func_set_natvie(XRLayer);
window.XRLightEstimate = function() {}
;trashvm.func_set_natvie(XRLightEstimate);
window.XRLightProbe = function() {}
;trashvm.func_set_natvie(XRLightProbe);
window.XRPose = function() {}
;trashvm.func_set_natvie(XRPose);
window.XRRay = function() {}
;trashvm.func_set_natvie(XRRay);
window.XRReferenceSpace = function() {}
;trashvm.func_set_natvie(XRReferenceSpace);
window.XRReferenceSpaceEvent = function() {}
;trashvm.func_set_natvie(XRReferenceSpaceEvent);
window.XRRenderState = function() {}
;trashvm.func_set_natvie(XRRenderState);
window.XRRigidTransform = function() {}
;trashvm.func_set_natvie(XRRigidTransform);
window.XRSession = function() {}
;trashvm.func_set_natvie(XRSession);
window.XRSessionEvent = function() {}
;trashvm.func_set_natvie(XRSessionEvent);
window.XRSpace = function() {}
;trashvm.func_set_natvie(XRSpace);
window.XRSystem = function() {}
;trashvm.func_set_natvie(XRSystem);
window.XRTransientInputHitTestResult = function() {}
;trashvm.func_set_natvie(XRTransientInputHitTestResult);
window.XRTransientInputHitTestSource = function() {}
;trashvm.func_set_natvie(XRTransientInputHitTestSource);
window.XRViewerPose = function() {}
;trashvm.func_set_natvie(XRViewerPose);
window.XRView = function() {}
;trashvm.func_set_natvie(XRView);
window.XRWebGLBinding = function() {}
;trashvm.func_set_natvie(XRWebGLBinding);
window.XRViewport = function() {}
;trashvm.func_set_natvie(XRViewport);
window.XRWebGLBinding = function() {}
;trashvm.func_set_natvie(XRWebGLBinding);
window.XRWebGLDepthInformation = function() {}
;trashvm.func_set_natvie(XRWebGLDepthInformation);
window.XRWebGLLayer = function() {}
;trashvm.func_set_natvie(XRWebGLLayer);
window.XSLTProcessor = function() {}
;trashvm.func_set_natvie(XSLTProcessor);

window.crossOriginIsolated = false;
window.getComputedStyle = function() {}
;trashvm.func_set_natvie(getComputedStyle);
window.offscreenBuffering = true;
window.showDirectoryPicker = function() {}
;trashvm.func_set_natvie(showDirectoryPicker);
window.showOpenFilePicker = function() {}
;trashvm.func_set_natvie(showOpenFilePicker);
window.showSaveFilePicker = function() {}
;trashvm.func_set_natvie(showSaveFilePicker);
window.trustedTypes = {};
window.webkitCancelAnimationFrame = function() {}
;trashvm.func_set_natvie(webkitCancelAnimationFrame);
window.webkitMediaStream = function() {}
;trashvm.func_set_natvie(webkitMediaStream);
window.webkitRTCPeerConnection = function() {}
;trashvm.func_set_natvie(webkitRTCPeerConnection);
window.webkitRequestAnimationFrame = function() {}
;trashvm.func_set_natvie(webkitRequestAnimationFrame);
window.webkitRequestFileSystem = function() {}
;trashvm.func_set_natvie(webkitRequestFileSystem);
window.webkitResolveLocalFileSystemURL = function() {}
;trashvm.func_set_natvie(webkitResolveLocalFileSystemURL);
window.webkitSpeechGrammar = function() {}
;trashvm.func_set_natvie(webkitSpeechGrammar);
window.webkitSpeechGrammarList = function() {}
;trashvm.func_set_natvie(webkitSpeechGrammarList);
window.webkitSpeechRecognition = function() {}
;trashvm.func_set_natvie(webkitSpeechRecognition);
window.webkitSpeechRecognitionError = function() {}
;trashvm.func_set_natvie(webkitSpeechRecognitionError);
window.webkitSpeechRecognitionEvent = function() {}
;trashvm.func_set_natvie(webkitSpeechRecognitionEvent);
window.webkitStorageInfo = function() {}
;trashvm.func_set_natvie(webkitStorageInfo);
window.webkitURL = function() {}
;trashvm.func_set_natvie(webkitURL);
window.webkitSpeechRecognition = function() {}
;trashvm.func_set_natvie(webkitSpeechRecognition);
window.webkitSpeechRecognition = function() {}
;trashvm.func_set_natvie(webkitSpeechRecognition);
window.webkitSpeechRecognition = function() {}
;trashvm.func_set_natvie(webkitSpeechRecognition);
window.NodeList = function NodeList(){};trashvm.func_set_natvie(NodeList);
window.Option = function Option(){};trashvm.func_set_natvie(Option);
window.PasswordCredential = function PasswordCredential(){};trashvm.func_set_natvie(PasswordCredential);
window.Performance = function Performance(){};trashvm.func_set_natvie(Performance);
window.Plugin = function Plugin(){};trashvm.func_set_natvie(Plugin);
window.XMLDocument = function XMLDocument(){};trashvm.func_set_natvie(XMLDocument);

window.XMLHttpRequestUpload = function XMLHttpRequestUpload(){};trashvm.func_set_natvie(XMLHttpRequestUpload);
window.XRFrame = function XRFrame(){};trashvm.func_set_natvie(XRFrame);
window.blur = function blur(){};trashvm.func_set_natvie(blur);
window.cancelAnimationFrame = function cancelAnimationFrame(){};trashvm.func_set_natvie(cancelAnimationFrame);
window.cancelIdleCallback = function cancelIdleCallback(){};trashvm.func_set_natvie(cancelIdleCallback);
window.openDatabase = function openDatabase(){};trashvm.func_set_natvie(openDatabase);
window.Plugin = function Plugin(){};trashvm.func_set_natvie(Plugin);
window.Plugin = function Plugin(){};trashvm.func_set_natvie(Plugin);
window.openDatabase = function openDatabase(){
    return  undefined;

};
window.external = {};
window['$_ts'] = {};
window.screen = {
    availHeight: 852,
    availLeft: 0,
    availTop: 0,
    availWidth: 1600,
    colorDepth: 24,
    height: 900,
    orientation: {angle: 0, type: 'landscape-primary', onchange: null},
    pixelDepth: 24,
    width: 1600
};
window.RTCPeerConnection = function RTCPeerConnection (){debugger};
window.TEMPORARY = 0;

window.toString=function(){
    return '[object Window]'
}


/**
 * Navigator
 */

//这个是创建一个Navigator 的构造函数
var Navigator = function Navigator()
{
    throw new TypeError("Illegal constructor")
};trashvm.func_set_natvie(Navigator);

Object.defineProperties(Navigator.prototype,{
    [Symbol.toStringTag]:{
        value:"Navigator",
        configurable:true
    }
});
Navigator.prototype.webdriver= false;

Object.defineProperty(Navigator.prototype,'webdriver',{
    get:function()
    {
        return false;
    }
});
trashvm.func_set_natvie(Object.getOwnPropertyDescriptor(Navigator.prototype,'webdriver').get);

navigator = {

    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    connection:{
        downlink: 10,
        effectiveType: "4g",
        onchange: null,
        rtt: 50,
        saveData: false,
    },
    cookieEnabled: true,

    language: "zh-CN",
    languages: ['zh-CN'],
    maxTouchPoints: 0,
    deviceMemory:8,
    hid:{},
    mimeTypes:  {},
    ink:{},
    platform: "Win32",
    plugins: [],
    product: "Gecko",
    productSub: "20030107",
    webkitPersistentStorage:{},
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    vendor: "Google Inc.",
    vendorSub: "",

     getBattery :function getBattery(){},

};


navigator.__proto__ = Navigator.prototype;

navigator.getBattery= function() {};trashvm.func_set_natvie(navigator.getBattery);
navigator.getGamepads= function() {};trashvm.func_set_natvie(navigator.getGamepads);
navigator.getInstalledRelatedApps= function() {};trashvm.func_set_natvie(navigator.getInstalledRelatedApps);
navigator.getUserMedia= function() {};trashvm.func_set_natvie(navigator.getUserMedia);
navigator.javaEnabled= function() {};trashvm.func_set_natvie(navigator.javaEnabled);
navigator.sendBeacon= function() {};trashvm.func_set_natvie(navigator.sendBeacon);
navigator.registerProtocolHandler= function() {};trashvm.func_set_natvie(navigator.registerProtocolHandler);
navigator.requestMIDIAccess= function() {};trashvm.func_set_natvie(navigator.requestMIDIAccess);
navigator.requestMediaKeySystemAccess= function() {};trashvm.func_set_natvie(navigator.requestMediaKeySystemAccess);
navigator.setAppBadge= function() {};trashvm.func_set_natvie(navigator.setAppBadge);
navigator.share= function() {};trashvm.func_set_natvie(navigator.share);
navigator.unregisterProtocolHandler= function() {};trashvm.func_set_natvie(navigator.unregisterProtocolHandler);
navigator.ibrate= function() {};trashvm.func_set_natvie(navigator.ibrate);
navigator.webkitGetUserMedia= function() {};trashvm.func_set_natvie(navigator.webkitGetUserMedia);
navigator.canShare= function() {};trashvm.func_set_natvie(navigator.canShare);
navigator.clearAppBadge= function() {};trashvm.func_set_natvie(navigator.clearAppBadge);
navigator.plugins.refresh = function() {}
;


/*
Location
*/


location = {
    host: "etax.hubei.chinatax.gov.cn",
    hostname: "etax.hubei.chinatax.gov.cn",
    href: "https://etax.hubei.chinatax.gov.cn/portal/",
    origin: "https://etax.hubei.chinatax.gov.cn",
    pathname:  "/portal/",
    port: "",
    protocol: "https:",
    search:"",
    toString:function(){return location.href}
};


/**
 *
 * Element
 */
 var Element = function Element(){

};

Element.prototype.getElementsByTagName = function getElementsByTagName(tagName){
        if(tagName == "i"){
            return []
        }

}




/**
 *
 * document
 */

var Document = function Document(){

};trashvm.func_set_natvie(Document);

Object.defineProperties(Document.prototype,{
    [Symbol.toStringTag]:{
        value:"Document",
        configurable:true
    }
});




document = {
    scripts:[
        {src:'http://www.fangdi.com.cn/4QbVtADbnLVIc/c.FxJzG50F.dfe1675.js'},
        {sec:'http://www.fangdi.com.cn/4QbVtADbnLVIc/c.FxJzG50F.dfe1675.js'},
    ],
    cookie:"",
    createElement : function createElement(tagName,options){
        if(tagName == "a"){
            var obj = {
                href:"",
                protocol:location.protocol,
                hostname:location.hostname,
                port:location.port,
                search:"",
                hash:"",
                origin:location.origin,
                pathname:""
            }
            obj = new Proxy(obj,{
                set:function(target,property,value)
                {
                    return Reflect.set(...arguments);
                }
            })
            return obj;
        }else if(tagName ==="form"){
            return {}
        }else{
            var tagName = new Element();
            return tagName
        }
    },
    getElementsByTagName:function getElementsByTagName(tagName){
        if(tagName == "meta"){
            var meta = {
                 content : "动态content"
                ,parentNode:{
                    removeChild : function removeChild(name){
                        //debugger;
                    }
                },
                getAttribute:function(name){
                    if(name=='r'){
                        return 'm'
                    }
                }
            };
            return [meta,meta]
        }else if(tagName = 'script'){
            var script = {
                getAttribute:function(name){
                    if(name=="r"){
                        return "m"
                    }
                },
                parentElement:{
                    removeChild : function removeChild(name){
                        //debugger;
                    }
                }
            };
            return [script,script]
        }else if(tagName = 'base'){
            return []
        }
    },
    getElementById:function getElementById(tagname){
        if(tagname == 'root-hammerhead-shadow-ui'){
            return null
        }
        debugger
    }

};

document.exitFullscreen = function exitFullscreen(){debugger};trashvm.func_set_natvie(document.exitFullscreen);
document.documentElement = {
    style:{},
    getAttribute:function getAttribute(name){
        //debugger;
        return null;
    },
    addEventListener : function addEventListener(){
        //方法体
        //debugger;
    }
};
document.characterSet = 'UTF-8';
document.body = null;

document.__proto__ = Document.prototype;
Document.prototype.__proto__ = EventTarget.prototype;


/**
 *
 *
 * DOMParser
 */

 DOMParser = {
    parseFromString:function parseFromString(){ debugger }
 };

 /**
  *
  * localStorage
  */

localStorage = {
    removeItem:function(key){
        delete localStorage[key]
    },
    getItem:function(key){
        return localStorage[key]
    },
    setItem:function(key,value){
        localStorage[key] =value;
    }
};

/**
 * sessionStorage
 */

 sessionStorage = {
    removeItem:function(key){
        delete sessionStorage[key]
    },
    getItem:function(key){
        return sessionStorage[key]
    },
    setItem:function(key,value){
        sessionStorage[key] =value;
    }
 }

 /**
  * XMLHttpRequest
  *
  */
  var XMLHttpRequestEventTarget = function XMLHttpRequestEventTarget() {
    throw new TypeError("Illegal constructor")
};trashvm.func_set_natvie(XMLHttpRequestEventTarget);

Object.defineProperties(XMLHttpRequestEventTarget.prototype,{
    [Symbol.toStringTag]:{
        value:"XMLHttpRequestEventTarget",
        configurable:true
    }
});



XMLHttpRequestEventTarget.prototype.__proto__ = EventTarget.prototype;



//这个创建的是XMLHttpRequest
var XMLHttpRequest = function XMLHttpRequest() {
    debugger;
};trashvm.func_set_natvie(XMLHttpRequest);

Object.defineProperties(XMLHttpRequest.prototype,{
    [Symbol.toStringTag]:{
        value:"XMLHttpRequest",
        configurable:true
    }
});
XMLHttpRequest.prototype.open = function open(){debugger;return arguments};
XMLHttpRequest.prototype.send = function send(){};

XMLHttpRequest.prototype.__proto__ = XMLHttpRequestEventTarget.prototype;

XMLHttpRequest = trashvm.proxy(XMLHttpRequest);
var Performance = function Performance(){
    throw new TypeError("Illegal constructor");
};trashvm.func_set_natvie(Performance);
Object.defineProperties(Performance.prototype, {
    [Symbol.toStringTag]: {
        value: "Performance",
        configurable: true
    }
});
Performance.prototype.navigation = {
    redirectCount: 0,
    type: 1,
}
Performance.prototype.eventCounts = {
    size:36
}
Performance.prototype.memory = {
    jsHeapSizeLimit: 4294705152,
    totalJSHeapSize: 51084006,
    usedJSHeapSize: 47570066,
}

Performance.prototype.now = function now(){
    debugger
    return 1390936
}
Performance.prototype.onresourcetimingbufferfull =  null;
Performance.prototype.timeOrigin = (new Date).getTime()+ Math.round(Math.random()*Math.pow(10,1))/Math.pow(10,1)

performance = {};
performance.__proto__ = Performance.prototype




window = trashvm.proxy(window);
navigator = trashvm.proxy(navigator);
location = trashvm.proxy(location);
document = trashvm.proxy(document);


delete __filename;