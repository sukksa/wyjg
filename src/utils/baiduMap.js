var map = new BMap.Map("map");
map.enableScrollWheelZoom(true);//启用滚轮缩放

map.centerAndZoom("", 15);


//根据经纬度创建标注方法
//function LoadPoint(longitude, lat) {
//    var point = new BMap.Point(longitude, lat);
//    if (longitude > 0 && lat > 0) {
//        map.centerAndZoom(point, 18);
//        // 用经纬度设置地图中心点
//        if (longitude != "" && lat != "") {
//            marker = new window.BMap.Marker(point);  // 创建标注
//            map.addOverlay(marker);    // 将标注添加到地图中
//            //marker.enableDragging();   //可拖拽
//        }
//        //点击标注
//         marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });
//    }
//}

//经纬度  基地名称 场景列表
function setInfoWindow(Jin, Wei, companyName, baseName, sceneList) {
  var point  = new BMap.Point(Jin, Wei);;
  var pointSign = $("#grade").val();
  if (pointSign == "1") {
    map.centerAndZoom(point, 5);
  }
  else { map.centerAndZoom(point, 10); }

  var marker = new BMap.Marker(point, { title: companyName + "-" + baseName });  // 创建标注
  marker.addEventListener("click", function () {
    var defaultHTML = "<div style='width:260px;height:auto!important;height:100px;min-height:100px;margin-top:3px;text-overflow : ellipsis;white-space : nowrap; overflow : hidden;' title='" + companyName + "'>" + companyName;
    defaultHTML += "<div style='margin-top:5px;border-bottom:1px dashed black;'></div>";
    defaultHTML += "<ul>"
    for (var item in sceneList) {
      var sceneInfo = sceneList[item];
      var id, name;
      id = sceneInfo.DeerpenId;
      name = sceneInfo.DeerpenName;
      defaultHTML += "<li class='info_li'>< a href=' ' onclick=javascript:clickOnShowCommon('" + id + "'); class='info_A' style='color:#0081C2;' title=" + name + ">" + name + "</ a></li>";
    }
    var infoWindow = new BMap.InfoWindow(defaultHTML);
    this.openInfoWindow(infoWindow);

  });
  map.addOverlay(marker);
  //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
}