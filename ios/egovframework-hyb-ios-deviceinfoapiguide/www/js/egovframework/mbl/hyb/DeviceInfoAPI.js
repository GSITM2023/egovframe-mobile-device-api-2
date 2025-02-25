/** 
 * @fileoverview 모바일 전자정부 하이브리드 앱 Network API 가이드 프로그램 JavaScript
 * JavaScript. 
 *
 * @author 서준식
 * @version 1.0 
 */

/*********************************************************
 * A TAG 링크 컨트롤
 *********************************************************/


/**
 * A tag의 링크 변경
 * @returns 
 * @type 
 */
function fn_egov_init_hrefLink(){
    $("#btnDeviceInfoList").attr("href","javascript:fn_egov_move_deviceInfoList();");
    $("#btnregistDeviceInfo").attr("href","javascript:fn_egov_regist_deviceInfo();");
    $("#btnMoveDeviceInfo").attr("href","javascript:fn_egov_move_deviceInfo();");
    $("#btnDeviceInfo").attr("href","javascript:fn_egov_move_deviceInfo();");
    $("#btnMoveDeviceInfoList").attr("href","javascript:fn_egov_move_deviceInfoList();");
}

/*********************************************************
 * iScroll 컨트롤 
 *********************************************************/

/** 디바이스 정보 리스트 페이지 iScroll */
var infoScroll;

/** 디바이스 정보 리스트 페이지 iScroll */
var detailScroll;

/** 디바이스 정보 리스트 페이지 iScroll */
var listScroll;


/**
 * iScroll 초기화 작업
 * @returns 
 * @type 
 */
function fn_egov_load_iScroll(){

    infoScroll = new IScroll("#infoWrapper", {
                                scrollX: true,
                                scrollbars: true,
                                mouseWheel: true,
                                interactiveScrollbars: true,
                                shrinkScrollbars: 'scale',
                                fadeScrollbars: true,
                                click: true
                            });

    detailScroll = new IScroll("#detailWrapper", {
                                scrollX: true,
                                scrollbars: true,
                                mouseWheel: true,
                                interactiveScrollbars: true,
                                shrinkScrollbars: 'scale',
                                fadeScrollbars: true,
                                click: true
                            });

    listScroll = new IScroll("#listWrapper", {
                                scrollX: true,
                                scrollbars: true,
                                mouseWheel: true,
                                interactiveScrollbars: true,
                                shrinkScrollbars: 'scale',
                                fadeScrollbars: true,
                                click: true
                             });

    document.addEventListener("touchmove", function (e) { e.preventDefault(); }, false);

}


/*********************************************************
 * 배터리 상태 모니터링
 *********************************************************/

/**
 * 배터리 관련 이벤트 등록 함수
 * @returns 
 * @type 
 */
function fn_egov_regist_batteryInvent(){
    window.addEventListener("batterystatus", fn_egov_onBatteryStatus, false);
    window.addEventListener("batterylow", fn_egov_onBatteryLow, false);
    window.addEventListener("batterycritical", fn_egov_onBatteryCritical, false);
}

/**
 * 배터리 상태 정보 콜백 함수
 * @returns 
 * @type 
 */
function fn_egov_onBatteryStatus(info) {
    // Handle the online event
    console.log("[DeviceAPIGuide] fn_egov_onBatteryStatus : Success ");
    navigator.notification.alert("Level: " + info.level + "%, isPlugged: " + info.isPlugged);
}

/**
 * 배터리 상태가 Low일때 호출되는 콜백 함수
 * @returns 
 * @type 
 */
function fn_egov_onBatteryLow(info) {
    // Handle the battery low event
    console.log("[DeviceAPIGuide] fn_egov_onBatteryLow : Success ");
    navigator.notification.alert("Battery Level Low " + info.level + "%"); 
}

/**
 * 배터리 경고 상태일 때 호출되는 콜백 함수
 * @returns 
 * @type 
 */
function fn_egov_onBatteryCritical(info) {
    // Handle the battery critical event
    console.log("[DeviceAPIGuide] fn_egov_onBatteryCritical : Success ");
    navigator.notification.alert("Battery Level Critical " + info.level + "%\nRecharge Soon!"); 
}

/*********************************************************
 * Network 정보 조회
 *********************************************************/

/**
 * Network 정보 조회 function.
 * @returns 
 * @type  
 */
function fn_egov_get_networkInfo() {
    var networkState = navigator.network.connection.type;
    
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
    
    return states[networkState];
    
}

/*********************************************************
 * Contacts 정보 조회
 *********************************************************/

/**
 * 연락처 정보 읽기
 * @returns 
 * @type 
 */
function fn_egov_get_contactsRead(contacts) 
{
    console.log("[DeviceAPIGuide] fn_egov_get_contactsRead : Success ");
    $('.deviceInfo:eq(3)').html("총 " + contacts.length + "개의 연락처");
    deviceInfoVO.telno = contacts.length;
}

/**
 * 연락처 정보 조회 실패
 * @returns 
 * @type 
 */
function fn_egov_get_contactsFail(msg) 
{
    console.log("[DeviceAPIGuide] fn_egov_get_contactsFail : Fail ");
}

/**
 * 연락처 정보 조회
 * @returns 
 * @type 
 */
function fn_egov_get_contacts() 
{
    var obj = new ContactFindOptions();
    obj.filter = "";
    obj.multiple = true;
    navigator.contacts.find(
                            [ "displayName", "name" ], 
                            fn_egov_get_contactsRead,
                            fn_egov_get_contactsFail, 
                            obj);
}


/*********************************************************
 * DeviceInfo VO 정의 
 *********************************************************/


/** 디바이스 정보  VO */
var deviceInfoVO = {
    sn : "",
    uuid : "",
    os : "",
    telno : "",
    strgeInfo : "",
    ntwrkDeviceInfo : "",
    pgVer : "",
    deviceNm : "",
    useyn : ""
}

/*********************************************************
 * Storage Info 조회
 *********************************************************/


/**
 * 전체 메모리 조회에 대한 성공 콜백 함수
 * @returns 
 * @type 
 */
function fn_egov_totalSpace_success(result){
    console.log("[DeviceAPIGuide] fn_egov_totalSpace_success : Success ");
    console.log("[DeviceAPIGuide] totalFileSystemSize : " + result.totalSpace);
    $('.deviceInfo:eq(5)').html(result.totalSpace + " MiB");
    deviceInfoVO.strgeInfo = result.totalSpace;
    
    return result.totalSpace;
}

/**
 * 프리 메모리 조회에 대한 성공 콜백 함수
 * @returns 
 * @type 
 */
function fn_egov_freeSpace_success(result){
    console.log("[DeviceAPIGuide] fn_egov_freeSpace_success : Success ");
    console.log("[DeviceAPIGuide] freeFileSystemSize : " + result.freeSpace);
    return result.freeSpace;
}

/**
 * 메모리 조회에 대한 실패 콜백 함수
 * @returns 
 * @type 
 */
function fn_egov_fail(error){
    console.log("[DeviceAPIGuide] fn_egov_fail : Success ");
    console.log("[DeviceAPIGuide] error : " + error);
}




/*********************************************************
 * Device Info 조회
 *********************************************************/

/**
 * Device Info 페이지로 이동 function.
 * @returns 디바이스 정보를 조회한 후 조회 페이지로 이동
 * @type  
 */
function fn_egov_move_deviceInfo(){
    fn_egov_load_deviceInfo();
    $.mobile.changePage('#deviceInfo');
    infoScroll.refresh();
}


/**
 * Device Info 로딩 function.
 * @returns 디바이스 API를 이용하여 디바이스 정보를 취득한 후 화면에 표시.
 * @type  
 */
function fn_egov_load_deviceInfo() {
    deviceInfoVO.ntwrkDeviceInfo = fn_egov_get_networkInfo();

    $('.deviceInfo:eq(0)').html(device.platform + " " + device.version);
    $('.deviceInfo:eq(1)').html(device.uuid);
    $('.deviceInfo:eq(2)').html(device.cordova);
    fn_egov_get_contacts();
    $('.deviceInfo:eq(4)').html(deviceInfoVO.ntwrkDeviceInfo);
    StorageInfo.totalFileSystemSize(fn_egov_totalSpace_success, fn_egov_fail, []);
}





/*********************************************************
 * Device Info 서버 컨트롤
 *********************************************************/



/**
 * Device Info 서버 전송 function.
 * @returns 화면에 표시된 디바이스 정보를 서버에 저장 요청한다.
 * @type  
 */
function fn_egov_regist_deviceInfo() {
    if(!fn_egov_network_check(false)){
        return false;
    }
    

    var params = {uuid :  device.uuid, os : device.platform + " " + device.version,
        telno :  deviceInfoVO.telno, strgeInfo : deviceInfoVO.strgeInfo,
        ntwrkDeviceInfo :  deviceInfoVO.ntwrkDeviceInfo , pgVer : device.cordova};
    
    jConfirm('디바이스 정보를 전송하시겠습니까?', '알림', 'c', function(r) {
             if (r == true) {
             
                EgovInterface.submitAsynchronous([params, "/dvc/addDeviceInfo.do"],
                                    function(result){
                                        if(result){
                                            navigator.notification.alert("전송 완료.", null, 'Info');
                                            console.log("[DeviceAPIGuide] fn_egov_regist_deviceInfo : Completed ");
                                        }else{
                                            navigator.notification.alert("서버 오류.", null, 'Info');
                                            console.log("[DeviceAPIGuide] fn_egov_regist_deviceInfo : Server Error ");

                                        }
                                        
                                    },
                                    function(error) {
                                        $("#alert_dialog").click( function() {
                                                                jAlert('데이터 입력 중 오류가 발생 했습니다.', '입력 오류', 'c');
                                                            });
                                    }
                                    );
             }
             });
    
	
}



/**
 * 서버에서 반환한 디바이스 정보 리스트를 화면에 출력한다.
 * @returns
 * @type  
 */
function fn_egov_move_deviceInfoList() {
    if(!fn_egov_network_check(false)){
        return false;
    }
	var params = {uuid : device.uuid };
    
    EgovInterface.submitAsynchronous([params, "/dvc/deviceInfoList.do"],
        fn_egov_dispatch_deviceInfoList,
        function(error) {
            $("#alert_dialog").click( function() {
                jAlert('데이터 조회 중 오류가 발생 했습니다.', '조회 오류', 'c');
            });
        }
    );
}


/**
 * Device Info List 화면 이동 function.
 * @returns 서버에 저장된 디바이스 정보를 요청받아 리스트 반환한다.
 * @type  
 */
function fn_egov_dispatch_deviceInfoList(data){
    
    var totcnt = 0;
    if(data){
        var list_html = "";
        totcnt = data.deviceInfoList.length;
        
        for (var i = 0; i < totcnt; i++) {
            result = data.deviceInfoList[i];
            
            list_html += "<li><a href='javascript:fn_egov_request_deviceInfoDetail(" + result.sn + ")'><h3>UUID : " + result.uuid + "</h3>";
            list_html += "<p><strong>Network Connection Type : " + result.ntwrkDeviceInfo + "</strong></p>";
            list_html += "<p>OS : " + result.os + "</p></a></li>";
            
        }
        
        var theList = $('#theList');
        theList.html(list_html);
        
        $.mobile.changePage("#deviceInfoList");
        theList.listview("refresh");
        
        console.log("[DeviceAPIGuide] fn_egov_dispatch_deviceInfoList : Completed ");
    }else{
        navigator.notification.alert("서버 오류.", null, 'Info');
        console.log("[DeviceAPIGuide] fn_egov_dispatch_deviceInfoList : Server Error ");
    }
    
    listScroll.refresh();
    if (totcnt < 1) {
        jAlert('서버에 저장된 디바이스\n 목록이 없습니다.','알림','b');
    }
    
}

/**
 * Device Info 상세 화면 요청 function.
 * @returns 서버에 저장된 디바이스 상세 정보를 반환한다.
 * @type  
 */
function fn_egov_request_deviceInfoDetail(data){
    if(!fn_egov_network_check(false)){
        return false;
    }
	var params = {sn : data };
    
    EgovInterface.submitAsynchronous([params, "/dvc/deviceInfo.do"],
                                    fn_egov_move_deviceInfoDetail,
                                    function(error) {
                                        $("#alert_dialog").click( function() {
                                                                jAlert('데이터 조회 중 오류가 발생 했습니다.', '조회 오류', 'c');
                                                            });
                                    }
                                    );
}

/**
 * Device Info 상세 화면을 생성한 후 이동 한다.
 * @returns 
 * @type  
 */
function fn_egov_move_deviceInfoDetail(result){
    
    if(result){
        $('.deviceInfo:eq(6)').html(result.deviceInfo.os);
        $('.deviceInfo:eq(7)').html(result.deviceInfo.uuid);
        $('.deviceInfo:eq(8)').html(result.deviceInfo.pgVer);
        $('.deviceInfo:eq(9)').html("총 " + result.deviceInfo.telno + "개의 연락처");
        $('.deviceInfo:eq(10)').html(result.deviceInfo.ntwrkDeviceInfo);
        $('.deviceInfo:eq(11)').html(result.deviceInfo.strgeInfo + " MiB");
        
        $("#btnDelDeviceInfo").attr("href","javascript:fn_egov_confirm_delete_deviceInfo(" + result.deviceInfo.sn + ");");
        $.mobile.changePage("#deviceInfoDetail");
        console.log("[DeviceAPIGuide] fn_egov_move_deviceInfoDetail : Completed ");
    }else{
        navigator.notification.alert("서버 오류.", null, 'Info');
        console.log("[DeviceAPIGuide] fn_egov_move_deviceInfoDetail : Server Error ");
    }
    
    detailScroll.refresh();

}


/**
 * Device Info 삭제 확인 function.
 * @returns 디바이스 정보 삭제 전 사용자 확인을 수행한다.
 * @type  
 */
function fn_egov_confirm_delete_deviceInfo(sn){
	jConfirm('디바이스 정보를 삭제 하시겠습니까??', '알림', 'c', function(r){
            if(r == true){
		        fn_egov_delete_deviceInfo(sn);
            }else{
             
            }
             
            });	
	
}

/**
 * Device Info 삭제 확인 function.
 * @returns 서버에 저장된 디바이스 정보 삭제를 요청한다.
 * @type  
 */
function fn_egov_delete_deviceInfo(data){
    
    if(!fn_egov_network_check(false)){
        return false;
    }
    
    console.log("fn_egov_delete_deviceInfo : ");
	var params = {sn : data };
    
    EgovInterface.submitAsynchronous([params, "/dvc/deleteDeviceInfo.do"],
                                    function(result){
                                    if(result){
                                        navigator.notification.alert("삭제 완료.", null, 'Info');
                                        console.log("[DeviceAPIGuide] fn_egov_delete_deviceInfo : Completed ");
                                        fn_egov_move_deviceInfoList();
                                    }else{
                                        navigator.notification.alert("서버 오류.", null, 'Info');
                                        console.log("[DeviceAPIGuide] fn_egov_delete_deviceInfo : Server Error ");
                                    }
                                      
                                    },
                                    function(error) {
                                        $("#alert_dialog").click( function() {
                                                                jAlert('데이터 조회 중 오류가 발생 했습니다.', '조회 오류', 'c');
                                                            });
                                    }
                                    );
	
}

