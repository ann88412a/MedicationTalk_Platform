// 接收 IoTtalk 資訊處理

var output_patient_barcode_bt = 0;
var output_pill_bt = 0;
var pill_detect = { 'Dilatrend': -1,
                    'Dilantin': -1,
                    'Requip': -1,
                    'Requip1': -1,
                    'Repaglinide': -1,
                    'Transamin': -1,
                    'Bokey': -1,
                    'Zocor': -1,
                    'FLU': -1,};

var syringe_value = {"AMIKACIN INJECTION 250MG/ML 'TAI YU'": -1,
                        "AMPOLIN INJECTION 500MG": -1,
                        "CEFAZOLIN INJECTION 1GM 'C.C.P.'": -1,
                        "CLEXANE INJECTION": -1,
                        "CORDARONE INJECTION": -1,
                        "Heparin Sodium Injection 5000 IU/ml 'Tai Yu'": -1,
                        "MILLISROL INJECTION": -1,
                        "Oxacillin Powder for Injection 'CYH'": -1,
                        "Progesterone Injection 'Chi Sheng'": -1,
                        "ROLIKAN INJECTION (SODIUM BICARBONATE)": -1,
                        "SODIUM BICARBONATE INJECTION 'CHI SHENG'": -1,
                        "Sirolac IV Injection 30 mg/ml 'ASTAR'": -1,};
var patient_barcode = '1234567890ABC'
var cognition = []

var client_uid = (Math.random() + 1).toString(36).substring(7) + (Math.random() + Math.random()).toString(36).substring(8);
console.log(client_uid);




$(function(){
        var iottalk_url = 'https://md.iottalk.tw';   // 'http://DomainName:port'; or 'https://DomainName';
        var mqtt_url = 'wss://iot.iottalk.tw:8866/mqtts'; // 'ws://IP:port/mqtt'; or 'wss://DomainName:port/mqtts'; 
        //var mqtt_url = 'wss://md.iottalk.tw:9997/mqtts';
        var mqtt_user =  'iottalk';
        var mqtt_password = 'iottalk2023';
        //var mqtt_password = 'iot2019';
        var exec_interval = 500;

        //csmapi.set_endpoint ('https://class.iottalk.tw');
        var profile = {
            'dm_name': 'Medication',          
            'idf_list':[BarcodeScanCmd_I, PillDetect_I, ClaCmd_I, VolumeRecoCmd_I, LessonPlan_I],
            'odf_list':[BarcodeResult_O, PillDetectResult_O, ClassificationResult_O, VolumeResult_O],
                // 'idf_list':[Dummy_Sensor],
                // 'odf_list':[Dummy_Control],
            'd_name': 'Platform0708',
            // 'd_name': 'Platform_Demo_anna',
        };
        // function Dummy_Sensor(data){
        //     // $('.ODF_value')[0].innerText=data[0];
        //  }
        // function Dummy_Control(data){
        //     // $('.ODF_value')[0].innerText=data[0];
        //  }
        // idf
        function BarcodeScanCmd_I(data){
            // $('.ODF_value')[0].innerText=data[0];
        }

        function PillDetect_I(data){
            // $('.ODF_value')[0].innerText=data[0];
        }

        function ClaCmd_I(data){
            // $('.ODF_value')[0].innerText=data[0];
        } 

        function VolumeRecoCmd_I(data){
            // $('.ODF_value')[0].innerText=data[0];
        }

        function LessonPlan_I(data){
            // $('.ODF_value')[0].innerText=data[0];
        }


        // odf
        function BarcodeResult_O(data){
            console.log('Barcode_Result_O', data);
            if (data[0] == client_uid){
                var data_value = JSON.parse(data[1]);
                console.log(data_value);
                console.log(data_value['barcode']);

                if (data_value['medicine_info']){
                    data_value = JSON.parse(data[1]);
                    console.log(document.getElementsByName("verification_button_id").value);
                    medicines[medicine_keys[document.getElementsByName("verification_button_id").value]]['verification'] = data_value['medicine_info'];
                    createtbl(); 

                    JumpToPage(5);
                }
                else{
                    $.getJSON(domain_name_url + '/api/_patient', {
                    barcode: data_value['barcode']
                    }, function(data) {
                    console.log(data);
                    var resp = data
                    $('.ODF_value')[0].innerText = resp['info'];
                    var img = document.getElementById('barcode_scanner');
                    img.src="pic/ok1.jpeg";
                    $('.patient_barcode_hint')[0].innerText = "★ 辨識完成請繼續執行下一步＾＿＾";
                    });
                }
                
                // if (data_value['patient_info']){
                //     $('.ODF_value')[0].innerText = data_value['patient_info'];
                //     var img = document.getElementById('barcode_scanner');
                //     img.src="pic/ok1.jpeg";
                //     $('.patient_barcode_hint')[0].innerText = "★ 辨識完成請繼續執行下一步＾＿＾";
                // }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    
                // else if (data_value['medicine_info']){
                //     data_value = JSON.parse(data[1]);
                //     medicines[medicine_keys[document.getElementsByName("verification_button_id").value]]['verification'] = data_value['medicine_info'][0];
                //     createtbl(); 
                //     JumpToPage(0); 
                // }
            }
            
        }

        function PillDetectResult_O(data){
            
            if (output_pill_bt > 0 && data[0] == client_uid){
                    var img = document.getElementById('pill_odf');
                    img.src="pic/ok1.jpeg";

                    pill_detect['Dilatrend'] = data[1];
                    pill_detect['Dilantin'] = data[8];
                    pill_detect['Requip'] = data[2];
                    pill_detect['Requip1'] = data[9];
                    pill_detect['Repaglinide'] = data[3];
                    pill_detect['Transamin'] = data[4];
                    pill_detect['Bokey'] = data[5];
                    pill_detect['Zocor'] = data[6];
                    pill_detect['FLU'] = data[7];
                    $('.pill_hint')[0].innerText = '★ 辨識完成請繼續執行下一步＾＿＾';

                    syringe_block = document.getElementById('syringe block');
                    syringe_block.style.display = "block";

                }
            
        }

        function ClassificationResult_O(data){
            // console.log('ClassificationResult_O', data);
            console.log('ClassificationResult_O', data[1]);
            console.log("Chosen type:", $("select[name='syringe_type']").val());
            
            if ($("select[name='syringe_type']").val() == data[1]){
                Volume_measurement()
                //dan.push('Volume-I',[client_uid,'plan1_Device_Demo', $("select[name='syringe_type']").val(), 1]);
            }
            else{
                console.log("樣式錯誤!");
                Reset_page2();
                alert("選擇與放入樣式不同!");
            }

        }

        function VolumeResult_O(data){
            console.log('VolumeResult_O', data);
            console.log('VolumeResult_O', data[2]);
            if(data[0] == client_uid){
                var Syringe_number = parseInt(medicines[medicine_keys[document.getElementsByName("injection_button_id").value]]['syringe_num']);
                // medicines[medicine_keys[document.getElementsByName("injection_button_id").value]]['injection'] = data[2];

                if(Syringe_number==2){
                    var button = document.getElementById('recognition_2');
                    if(button.value=='unclicked'){
                        medicines[medicine_keys[document.getElementsByName("injection_button_id").value]]['injection'] = data[2];
                        createtbl();
                        enableButton('recognition_1');
                        var fontElement1 = document.getElementById("show_syringe_volume1");
                        fontElement1.innerHTML = "第1支針 - 辨識數值 : " + data[2].toString() + " ml";
                        //顯示第二支針劑的文字和按鈕
                        var button = document.getElementById('recognition_2');
                        button.style.display = "block";
                        var fontElement2 = document.getElementById("show_syringe_volume2");
                        fontElement2.style.display = "block";
                        console.log("第1支針辨識完成");
                        // console.log(data);
                    }
                    else{
                        medicines[medicine_keys[document.getElementsByName("injection_button_id").value]]['injection'] += data[2];
                        enableButton('recognition_2');
                        createtbl();
                        var fontElement = document.getElementById("show_syringe_volume2");
                        fontElement.innerHTML = "第2支針 - 辨識數值 : " + data[2].toString() + " ml";
                        enableButton("next_step");
                        clickCheck('recognition_1');
                        clickCheck('recognition_2');
                        console.log("第2支針辨識完成");
                        // console.log(data);
                    }
                }
                else{
                    medicines[medicine_keys[document.getElementsByName("injection_button_id").value]]['injection'] = data[2];
                    enableButton('recognition_1');
                    var fontElement = document.getElementById("show_syringe_volume1");
                    fontElement.innerHTML = "針劑辨識數值 : " + data[2].toString() + " ml";
                    createtbl();
                    var button = document.getElementById("next_step");
                    button.disabled = false;
                    console.log("辨識完成");
                }
            }
        }


        



        
      
/*******************************************************************/                
        function ida_init(){
        console.log(profile.d_name);
    }
        var ida = {
            'ida_init': ida_init,
            'iottalk_url': iottalk_url,
            'mqtt_url': mqtt_url,
            'mqtt_user': mqtt_user,
            'mqtt_password': mqtt_password,
            'exec_interval': exec_interval,
        }; 
        dai(profile,ida);     
});