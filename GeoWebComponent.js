/**
 * Created by Kike on 3/17/15.
 */
function GeoWeb(){
    var GeoWebProto = Object.create(HTMLDivElement.prototype);
    Object.defineProperties(GeoWebProto,{
        "geoConfig":{
            "value":{
                "enableHighAccuracy": true,
                "timeout": 15000,
                "maxinumAge":60000
            },
            "writable":false,
        },
        "marker":{
            "value":{
                "style":{"size":"mid","color":"blue","label":"test"},
                "locations":[]
            },
            "writable":true
        },
        "maptype":{
            "value":"",
            "writable":true
        },
        "size":{
            "value":{"width":0,"height":0},
            "writable":true
        },
        "zoom":{
            "value":10,
            "writable":true
        },
        "div":{
            "get": function(){
                return this.shadowRoot.getElementsByTagName('div')[0];
            }
        }
    });

    GeoWebProto.createdCallback = function(){
        this.style.position='absolute';
        var shadow = this.createShadowRoot();
        var pdiv = document.createElement('div');
        pdiv.style.width='600px';
        pdiv.style.height='600px';
        pdiv.style.border='groove';
        pdiv.tabIndex=1;
        pdiv.onfocus = function(){this.style.borderColor='red'};
        pdiv.onblur = function(){this.style.borderColor='steelblue'};
        this.size.width=600;
        this.size.height=600;
        pdiv.style.borderWidth='4px';
        pdiv.style.borderColor='steelblue';
        pdiv.style.borderRadius='10px';
        pdiv.addEventListener('dblclick',scrollMap,false);
        pdiv.addEventListener('keydown',scrollMap,false);
        shadow.appendChild(pdiv);
        var findbutton = document.createElement('button');
        findbutton.tabIndex=2;
        findbutton.style.borderColor='red'
        findbutton.onfocus = function(){this.style.borderColor='steelblue';};
        findbutton.onblur = function(){this.style.borderColor='red'};
        findbutton.onmousedown = function(){this.style.backgroundColor='steelblue';};
        findbutton.onmouseup = function(){this.style.backgroundColor='#c0392b';};
        findbutton.onkeydown = function(e){if (e.keyCode==13) this.click();};
        findbutton.style.position = 'absolute';
        findbutton.style.top = '10px';
        findbutton.style.left= '10px';
        findbutton.style.width='90px';
        findbutton.style.border = 'inset';
        findbutton.style.fontSize='14px';
        findbutton.style.fontFamily='Lucida Grande';
        findbutton.style.textAlign='center';
        findbutton.style.color='white';
        findbutton.style.backgroundColor='#c0392b';
        findbutton.style.borderRadius='10px';
        findbutton.addEventListener('click',getPosition,false);
        findbutton.textContent ='Locate';
        shadow.appendChild(findbutton);
    };

    function Positionate(position){
        GeoWebProto.marker.locations[0]={"longitude": position.coords.longitude, "latitude" : position.coords.latitude};
        var url;
        if(GeoWebProto.marker.locations.length>0) {
             url = "http://maps.google.com/maps/api/staticmap?center=&markers=size:"+GeoWebProto.marker.style.size+"|color:"+GeoWebProto.marker.style.color+"|label:"+GeoWebProto.marker.style.label+"|";
            for(var i = 0; i<GeoWebProto.marker.locations.length;i++)
                url+= GeoWebProto.marker.locations[i].latitude+","+GeoWebProto.marker.locations[i].longitude;
            url += "&size="+GeoWebProto.size.width+"x"+GeoWebProto.size.height+"&zoom="+GeoWebProto.zoom+"&sensor=false";
        }
        console.log(GeoWebProto.zoom);
        GeoWebProto.setMap(encodeURI(url));
    };
    function ErrorHandler(error){
        alert('Error: '+error.code+' '+ error.message);
    };
    function getPosition(){
        if(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(Positionate,ErrorHandler,GeoWebProto.geoConfig);
        else
            alert("geo location, NOT SUPPORTED");
    }
    function scrollMap(e){
        console.log(e);
        if(e.type=='dblclick' || e.keyCode==38)
            GeoWebProto.zoomVal(2);
        else if (e.keyCode==40)
            GeoWebProto.zoomVal(-2);

    }
    GeoWebProto.setMapType = function(map){
        this.maptype=map;
    };

    GeoWebProto.setSize = function(w,h){
        this.size.width = w;
        this.size.height = h;
    };

    GeoWebProto.zoomVal = function(z){
        if(typeof z ==='number'){
            GeoWebProto.zoom+=z;
            getPosition();
        }
    };
    GeoWebProto.setMap = function(url){
        console.log(url);
        document.getElementsByTagName('x-geoweb')[0].shadowRoot.querySelector('div').style.backgroundImage='url('+url+')';
    };

    GeoWebProto.newMarker = function(size,color,label,longitude,latitude){

    };
    var GeoWeb = document.registerElement('x-geoweb',{prototype : GeoWebProto});
    return new GeoWeb();

}