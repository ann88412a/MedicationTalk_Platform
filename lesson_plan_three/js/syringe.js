var medicines = {};
var med_order;
var way_dic = {
    "Add to IV bag" : "加在點滴袋內",
    "IVD" : "IVD",
    "IVP" : "IVP",
    "IVPUMP" : "IVPUMP",
    "intramuscular injection" : "肌肉注射",
    "subcutaneous injection" : "皮下注射",
    "intradermal injection": "皮內注射",
    "Three fingers below the acromion" : "肩峰下三橫指",
    "elbow" : "手肘",
    "back of hand" : "手背",
    "right upper abdomen" : "右上腹",
    "right lower abdomen" : "右下腹",
    "left upper abdomen" : "左上腹",
    "left lower abdomen" : "左下腹",
    "left upper hip" : "左上內側臀",
    "left lower hip" : "左下內側臀",
    "right upper hip" : "右上內側臀",
    "lower right hip" : "右下內側臀",
    "forearm" : "前臂"
};


function create_json(med, checked){
    if(checked){
        medicines[med] = {
            verification:null,
            dilution:-1,
            injection:-1,
            way:null,
            after_dilution:null,
            syringe_num:-1
        }
    }
    else{
        delete medicines[med];
    }
    createtbl();
}


var medicine_keys
function createtbl() {
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    table.border = "3";
    table.appendChild(thead);
    table.appendChild(tbody);
    var globaldiv = document.getElementById("medtable");
    if (globaldiv) {
        globaldiv.innerHTML = "";
        globaldiv.appendChild(table);
    }
    // Creating and adding data to first row of the table
    let row_1 = document.createElement('tr');
    let heading_1 = document.createElement('th');
    heading_1.innerHTML = "No.";
    let heading_2 = document.createElement('th');
    heading_2.innerHTML = "藥劑名稱";
    let heading_3 = document.createElement('th');
    heading_3.innerHTML = "驗證藥物";
    let heading_4 = document.createElement('th');
    heading_4.innerHTML = "稀釋總量";
    let heading_5 = document.createElement('th');
    heading_5.innerHTML = "施打總量";
    let heading_6 = document.createElement('th');
    heading_6.innerHTML = "給藥途徑";

    row_1.appendChild(heading_1);
    row_1.appendChild(heading_2);
    row_1.appendChild(heading_3);
    row_1.appendChild(heading_4);
    row_1.appendChild(heading_5);
    row_1.appendChild(heading_6);
    thead.appendChild(row_1);

    
    medicine_keys = Object.keys(medicines);
    for (i=0; i<medicine_keys.length; i++) {
        // Creating and adding data to second row of the table
        let row_2 = document.createElement('tr');
        let row_2_data_1 = document.createElement('td');
        row_2_data_1.style.textAlign = "center";
        row_2_data_1.innerHTML = i+1;
        let row_2_data_2 = document.createElement('td');
        row_2_data_2.innerHTML = medicine_keys[i];
        row_2_data_2.style.textAlign = "center";
        let row_2_data_3 = document.createElement('td');
        row_2_data_3.style.textAlign = "center";
        if (medicines[medicine_keys[i]]['verification'] != null){
            row_2_data_3.innerHTML = "已掃描<br>";

            let button = document.createElement('button');
            button.innerHTML = "重新驗證藥物"; // 設置按鈕的文本
            button.name = "syringe_verification";
            button.style.color = "white";
            button.style.fontFamily = "verdana";
            button.style.fontSize = "18px";
            button.style.borderRadius = "10px";
            button.style.backgroundColor = "orange";
            button.style.textAlign = "center";
            
            // 添加點擊事件處理程序
            button.addEventListener('click', (function(index) {
                return function(){
                    JumpToPage(1);
                    Getbutton_id(1, index);
                    Getbutton_id(2, index);
                    Getbutton_id(3, index);
                    Getbutton_id(6, index);
                    ChangeTitle(1);
                    console.log(index);
                };
            })(i));

            // 將按鈕添加到 row_2_data_3 元素中
            row_2_data_3.appendChild(button);
        }
        else{
            row_2_data_3.innerHTML = '<button name="syringe_verification" style="color: white;font-family:verdana;font-size:18px;border-radius: 10px;background-color: green;text-align:center;" onclick="JumpToPage(1);Getbutton_id(1,'+i+');Getbutton_id(2, '+i+');Getbutton_id(6, '+i+');Getbutton_id(3, '+i+');ChangeTitle(1);test('+i+');">驗證</button>';
            row_2_data_3.style.textAlign = "center";
        }
        
        let row_2_data_4 = document.createElement('td');
        row_2_data_4.style.textAlign = "center";
        if (medicines[medicine_keys[i]]['dilution'] < 0){
            row_2_data_4.innerHTML = '尚未輸入';
        }
        else{
            row_2_data_4.innerHTML = medicines[medicine_keys[i]]['dilution'] + "/ml";
        }

        let row_2_data_5 = document.createElement('td');
        row_2_data_5.style.textAlign = "center";
        if (medicines[medicine_keys[i]]['injection']<0){
            row_2_data_5.innerHTML = '尚未辨識';
        }
        else{
            row_2_data_5.innerHTML = medicines[medicine_keys[i]]['injection'] + "/ml  " ;
        }
  
        
        
        let row_2_data_6 = document.createElement('td');
        
        var way_result = ""
        if (medicines[medicine_keys[i]]['way'] != null){
            if (medicines[medicine_keys[i]]['way'].length>1){
                row_2_data_6.innerHTML = way_dic[medicines[medicine_keys[i]]['way'][0]] + "," + way_dic[medicines[medicine_keys[i]]['way'][1]];
            }
            else{
                row_2_data_6.innerHTML = way_dic[medicines[medicine_keys[i]]['way'][0]];
            }
            row_2_data_6.style.textAlign = "center";
        }
        else{
            row_2_data_6.innerHTML = '尚未選擇';
            row_2_data_6.style.textAlign = "center";
        }

        row_2.appendChild(row_2_data_1);
        row_2.appendChild(row_2_data_2);
        row_2.appendChild(row_2_data_3);
        row_2.appendChild(row_2_data_4);
        row_2.appendChild(row_2_data_5);
        row_2.appendChild(row_2_data_6);
        tbody.appendChild(row_2);
    }
    
}
window.addEventListener("load",createtbl);


function test(i){
    console.log(i);
}


function ChangeTitle(i) {
    var nobarElement = document.getElementById("title");

    switch(i){
        case 0:
            nobarElement.innerHTML = "指示 4<br>開始給針劑";
            break;
        case 1:
            nobarElement.innerHTML = "指示 5<br>確認藥瓶上有無條碼";
            break;
        case 2:
            nobarElement.innerHTML = "指示 6<br>拿掃描機<br>掃藥瓶上的條碼";
            break;
        case 3:
            nobarElement.innerHTML = "指示 6<br>點選你的藥物";
            break;
        case 4:
            nobarElement.innerHTML = "指示 7<br>輸入瓶數、空針與稀釋溶液量";
            break;
        case 5:
            nobarElement.innerHTML = "指示 8<br>判斷針劑數值";
            break;
        case 6:
            nobarElement.innerHTML = "指示 9<br>進行注射";
            break;
        case 7:
            nobarElement.innerHTML = "指示 10<br>選取給藥途徑";
            break;
    }

}


function JumpToPage(page) {
    for (let i = 0; i <= 8; i++) {
        document.getElementById(`page${i}`).hidden = (i === page) ? false : true;
    }
}


function tabSW(evt, tab_ID) {
var i, tabcontent, tablinks;

// 使用 class="tabcontent" 獲取所有元素並隱藏它們
tabcontent = document.getElementsByClassName("tabcontent");
for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
}

// 獲取所有帶有 class="tablinks" 的元素並删除類 "active"
tablinks = document.getElementsByClassName("tablinks");
for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
}

// 顯示當前選項卡，並添加"活動"選項卡 類到打開選項卡的按鈕
document.getElementById(tab_ID).style.display = "block";
evt.currentTarget.className += " active";
}

function Getbutton_id(page_type, button_id){
    if(page_type=='2'){  //劑量
        document.getElementsByName("injection_button_id").value= button_id;
    }
    else if(page_type=='3'){  //給藥途徑
        document.getElementsByName("way_button_id").value= button_id;
    }
    else if (page_type=='6'){ //稀釋
        document.getElementsByName("dilution_button_id").value = button_id;
    }
    else if(page_type=='1'){ //條碼or圖片
        document.getElementsByName("verification_button_id").value = button_id;
    }

    }

      


function GetOption(p){

    if(p==8){
        if ($('input[name=injection_info]:checked').val()){
            medicines[medicine_keys[document.getElementsByName("way_button_id").value]]['way'] = [$('input[name=injection_info]:checked').val()]; 
            JumpToPage(0);
            ChangeTitle(0);
        }
        else{
            alert('請選擇針劑給藥途徑!');
        }
    }       
    else if(p==9){
        if ($('input[name=injection_info]:checked').val()==undefined){
            alert('請選擇注射部位!');
        }
        else if ($('input[name=injection_info_site]:checked').val()==undefined){
            alert('請選擇注射角度!');
        }
        else{
            medicines[medicine_keys[document.getElementsByName("way_button_id").value]]['way'] = [$('input[name=injection_info]:checked').val(), $('input[name=injection_info_site]:checked').val()]; 
            JumpToPage(0);
            ChangeTitle(0);
        }
    }
    else if(p==6){
        // 防呆功能
        var selectElement1 = document.getElementsByName("syringe_num")[0];
        var selectedValue1 = selectElement1.value;

        var selectElement2 = document.getElementsByName("syringe_type")[0];
        var selectedValue2 = selectElement2.value;

        var inputValue = document.getElementsByName("syringe_diluent_value")[0].value;
        // 使用正則表達式檢查輸入值是否為整數
        var isInteger = /^\d+$/.test(inputValue);

        if (selectedValue1 == ""){
            alert("尚未選擇欲使用針筒數量!");
        }
        else if (selectedValue2 == "") {
            alert("尚未選擇空針樣式!");
        }
        else if (!isInteger){
            alert("請輸入稀釋數值!");
        }
        else{
            JumpToPage(2);
        }


        medicines[medicine_keys[document.getElementsByName("dilution_button_id").value]]['dilution'] = $('input[name="syringe_diluent_value"]').val();
        medicines[medicine_keys[document.getElementsByName("dilution_button_id").value]]['syringe_num'] = $('select[name="syringe_num"]').val();
        // console.log($('input[name="syringe_diluent_value"]').val());
    }

    // console.log(medicines[medicine_keys[0]]);
    // console.log(medicines[medicine_keys[1]]);

    createtbl();
    }


function SyringeFeedback(){
    console.log('2:', document.getElementById('check2').checked);
    console.log('3:', document.getElementById('check3').checked);
    console.log('6:', document.getElementById('check2').checked);

    if (medicines != {}){
        var VerificationDetail = document.getElementById("VerificationDetail");
        if (!medicines['Progesterone 25mg/ml']){ //沒給藥
            VerificationDetail.innerHTML = "錯誤原因:必須給此藥";
        }
        else{ //有給藥，判斷細項
            var errorMessage = '';
            console.log(medicines['Progesterone 25mg/ml']['injection']);
            console.log(medicines['Progesterone 25mg/ml']['way']);

            if (medicines['Progesterone 25mg/ml']['verification']!='1234567890ABC'){
                errorMessage += '驗證錯誤,<br>';
            }
            if (medicines['Progesterone 25mg/ml']['injection']!=1.5){
                errorMessage += " 劑量錯誤, 您給的劑量為" + medicines['Progesterone 25mg/ml']['injection'] +"ml, <br>";
            }
            if ((medicines['Progesterone 25mg/ml']['way'][0] =='Three fingers below the acromion' || 
                medicines['Progesterone 25mg/ml']['way'][0] == 'left upper hip' || 
                medicines['Progesterone 25mg/ml']['way'][0] == 'right upper hip')
                && medicines['Progesterone 25mg/ml']['way'][1]=='intramuscular injection'){

                errorMessage += " 途徑錯誤, 您選擇的途徑為 " + way_dic[medicines['Progesterone 25mg/ml']['way'][0]] + "," + way_dic[medicines['Progesterone 25mg/ml']['way'][1]] + "<br>" + 
                "正確途徑應為以下,<br>" + "注射部位:肩峰下三橫指,左上內側臀,右上內側臀(三擇一)" + "<br>" + "注射角度:肌肉注射" + "<br>";
            
            }

            if (errorMessage !== '') { 
                // errorMessage = errorMessage.slice(0, -2);
                VerificationDetail.innerHTML = errorMessage;
            } else {  //各項條件都符合
                VerificationDetail.innerHTML = '很棒，您的給藥知識正確!';
            }
            
        }

        var VerificationDetail2 = document.getElementById("VerificationDetail2");
        if (medicines['Clexane 6,000 anti-Xa IU/0.6 ml']){
            VerificationDetail2.innerHTML = 
            "錯誤原因:實際給藥錯誤";
        }
        else{  //給藥原因待判斷
            VerificationDetail2.innerHTML = "很棒，您的給藥知識正確!";
        }

        var VerificationDetail3 = document.getElementById("VerificationDetail3");
        if (medicines['Ocillina 500mg/vail']){
            VerificationDetail3.innerHTML = 
            "錯誤原因:MAR單錯誤";
        }
        else{ //給藥原因待判斷
            VerificationDetail3.innerHTML = "很棒，您的給藥知識正確!";
        }
    }
}


function Barcode(on_off){
    dan.push('Barcode-I',[client_uid,'plan1_Device_Demo','syringe', on_off]);
}


function Syringe_recognition(){
    dan.push('Syringe-I',[client_uid,'plan1_Device_Demo', $("select[name='syringe_type']").val(), 1]);
}