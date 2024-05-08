// 制定回饋規則 打分機制

function feedback(){
    console.log(syringe_value);
    var wrong_syringe = 0;
    for (const [key, value] of Object.entries(syringe_value)) {
        if (value[0] != 0){
            wrong_syringe = wrong_syringe + 1;
        }
      }

    var score = 0;
    
    var id_name = 'ID：' + document.getElementById('IDF_ID').value + ' 姓名：' + document.getElementById('IDF_name').value;
    $('.ODF_ID')[0].innerText= id_name;

    // 1
    const radios = document.getElementsByName('barcode');
    var img1 = document.getElementById('1 img');
    paitent_r = ''
    if (radios[1].checked){
        cognition.push(1);
        score = score + 1;
        img1.src="pic/ok_w.png";
        paitent_r = '您非常細心，有觀察到病人身分錯誤，繼續保持!' ;
        correctness.push(1);
    }else{
        cognition.push(0);
        img1.src="pic/wrong_w.png";
        paitent_r = '掃描結果：' + $('.ODF_value')[0].innerText + ',   您判斷是否正確： No  <br>病人的名字與出生年月日皆錯誤。<b style="color: #228de5;">李翊菲82/11/04為錯誤</b>(43/02/01)；<font style="color: #00B050;">正確為李亦霏79/05/31</font>  <br><font style="color: #f44336;">★ 給藥之前，要先核對患者身份 。 <font style="background-color: yellow;">身份辨識方式</font>包括，詢問對方的「姓名」與「出生年月日」</font>';
        correctness.push(0);
    }
    
    document.getElementById('paitent r').innerHTML = paitent_r;


    // 2
    var img2 = document.getElementById('2 img');
    if (!document.getElementById('check1').checked){
        c2r = ''
        r2r = ''
        // r2r = '您不給 Concor 5mg/tab 的理由：' + document.getElementById('Concor 5mg/tab r no').value;
        reason.push(document.getElementById('Anpo 10mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Lanpo 30mg/tab'] == 0 && pill_detect['Apno 30mg/tab'] == 0 ){ 
            score = score + 1;
            img2.src="pic/ok_w.png";
            c2r ='答對了 你好棒!'
            correctness.push(1);

        }else{
            img2.src="pic/wrong_w.png";
            r2r = '答錯原因：實際給藥錯誤<br>藥袋內<b style="color: #228de5;">藥物錯誤</b> (Lanpo)，<font style="color: #00B050;">正確藥物為 (Anpo)</font><br><font style="color: #f44336;">★ 核對不僅是藥袋名稱，還要注意<font style="background-color: yellow;">藥袋內的藥名</font>，<font style="text-decoration:underline;">Lanpo</font> 和 <font style="text-decoration:underline;">Anpo</font>乍看前面的英文字很像，因此需要小心辨識！</font>';
            correctness.push(0);

        }
        document.getElementById('2 r 2').innerHTML = r2r;
        document.getElementById('2 r').innerHTML = c2r;

    }else{
        cognition.push(0);
        img2.src="pic/wrong_w.png";
        // r2 = '您給 Anpo 10mg/tab 的理由：' + document.getElementById('Anpo 10mg/tab r').value;
        r2 = '答錯原因：MAR單認知錯誤<br>藥袋內<b style="color: #228de5;">藥物錯誤</b> (Lanpo)，<font style="color: #00B050;">正確藥物為 (Anpo)</font><br><font style="color: #f44336;">★ 核對不僅是藥袋名稱，還要注意<font style="background-color: yellow;">藥袋內的藥名</font>，<font style="text-decoration:underline;">Lanpo</font> 和 <font style="text-decoration:underline;">Anpo</font>乍看前面的英文字很像，因此需要小心辨識！</font>';
        document.getElementById('2 r 2').innerHTML = r2;
        correctness.push(0);
        reason.push(document.getElementById('Anpo 10mg/tab r').value);
    
    }
    
    // 3
    var img3 = document.getElementById('3 img');
    r3r = ''
    if (document.getElementById('check2').checked){
        c3r = ''
        r3r = ''
        // r3r = '您不給 Progesterone 25mg/ml 的理由：' + document.getElementById('Progesterone 25mg/ml r no').value;
        reason.push(document.getElementById('Progesterone 25mg/ml r').value);
        cognition.push(1); // 藥袋內劑量錯誤(240mg)，正確劑量為(40mg)
        
        if (medicines['Progesterone 25mg/ml']['verification']=='4710031297121' && 1.4<=medicines['Progesterone 25mg/ml']['injection'] && medicines['Progesterone 25mg/ml']['injection']<=1.6 
        && (medicines['Progesterone 25mg/ml']['way'][0] =='Three fingers below the acromion' || medicines['Progesterone 25mg/ml']['way'][0] == 'left upper hip' || medicines['Progesterone 25mg/ml']['way'][0] == 'right upper hip') 
        && medicines['Progesterone 25mg/ml']['way'][1]=='intramuscular injection' && medicines['Progesterone 25mg/ml']['dilution']=="0"){
            score = score + 1;
            img3.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img3.src="pic/wrong_w.png";
            // r3r = r3r + '\n -> 答錯原因：實際給藥錯誤';
            r3r = ' -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('3 r 3').innerHTML = r3r;

    }else{
        cognition.push(0);
        img3.src="pic/wrong_w.png";
        r3 = '您給 Progesterone 25mg/ml 的理由：' + document.getElementById('Progesterone 25mg/ml r').value;
        document.getElementById('3 r').innerHTML = r3;
        r3 = r3 + '\n -> 答錯原因：MAR單認知錯誤';
        correctness.push(0);
        reason.push(document.getElementById('Progesterone 25mg/ml r no').value);
    }


    // 4
    var img4 = document.getElementById('4 img');
    r4r = ''
    if (!document.getElementById('check3').checked){
        c4r = ''
        r4r = ''
        r4r = '您不給 Clexane 60mg/0.6ml 的理由：' + document.getElementById('Clexane 60mg/0.6ml r no').value;
        reason.push(document.getElementById('Clexane 60mg/0.6ml r no').value);
        cognition.push(1);
        if (1==1){ 
            score = score + 1;
            img4.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img4.src="pic/wrong_w.png";
            r4r = '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('4 r 4').innerHTML = r4r;

    }else{
        cognition.push(0);
        img4.src="pic/wrong_w.png";
        r4 = '您給 Clexane 60mg/0.6ml 的理由：' + document.getElementById('Clexane 60mg/0.6ml r').value;
        document.getElementById('4 r').innerHTML = r4;
        correctness.push(0);
        reason.push(document.getElementById('Clexane 60mg/0.6ml r').value);
    
    }


    // 5
    var img5 = document.getElementById('5 img');
    
    if (!document.getElementById('check4').checked){
        c5r = ''
        r5r = ''
        // r5r = '您不給 Sennoside 12mg/tab 的理由：' + document.getElementById('Sennoside 12mg/tab r no').value;
        reason.push(document.getElementById('Sennoside 12mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Sennoside'] == 0){ 
            score = score + 1;
            img5.src="pic/ok_w.png";
            c5r='加油~'
            correctness.push(1);

        }else{
            img5.src="pic/wrong_w.png";
            r5r = '\n -> 答錯原因：實際給藥錯誤<br>Sennoside<b style="color: #228de5;">時間錯誤</b>，醫囑時間為HS (睡前)，情境給藥時間是早上九點，故此藥目前不給。釐清若是前一晚沒吃到應告知醫師或專科護理師<br><font style="color: #f44336;">★ 注意<font style="background-color: yellow;">醫囑給藥時間與當下病患狀況是否吻合</font>。</font>';
            correctness.push(0);

        }
        document.getElementById('5 r').innerHTML = c5r;
        document.getElementById('5 r 5').innerHTML = r5r;

    }else{
        cognition.push(0);
        img5.src="pic/wrong_w.png";
        // r5 = '您給 Sennoside 12mg/tab 的理由：' + document.getElementById('Sennoside 12mg/tab r').value;
        r5 = '\n -> 答錯原因：MAR單認知錯誤<br>Sennoside<b style="color: #228de5;">時間錯誤</b>，醫囑時間為HS (睡前)，情境給藥時間是早上九點，故此藥目前不給。釐清若是前一晚沒吃到應告知醫師或專科護理師<br><font style="color: #f44336;">★ 注意<font style="background-color: yellow;">醫囑給藥時間與當下病患狀況是否吻合</font>。</font>';
        document.getElementById('5 r 5').innerHTML = r5;
        correctness.push(0);
        reason.push(document.getElementById('Sennoside 12mg/tab r').value);
    
    }


    // 6
    var img6 = document.getElementById('6 img');
    
    if (!document.getElementById('check5').checked){
        c6r = ''
        r6r = ''
        // r6r = '您不給 Peace 2.5mg/tab 的理由：' + document.getElementById('Peace 2.5mg/tab r no').value;
        reason.push(document.getElementById('Peace 2.5mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Peace'] == 0){ 
            score = score + 1;
            img6.src="pic/ok_w.png";
            c6r = '你好棒~'
            correctness.push(1);

        }else{
            img6.src="pic/wrong_w.png";
            r6r = '\n -> 答錯原因：實際給藥錯誤<br>從目前的病患資訊，<font style="color: #228de5;">病人沒有臨床證據使用Peace的適應症</font>，應向醫師或專科護理師確認<br> <font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上<font style="background-color: yellow;">有服用該藥物的適應症</font></font>';
            correctness.push(0);

        }
        document.getElementById('6 r').innerHTML = c6r;
        document.getElementById('6 r 6').innerHTML = r6r;

    }else{
        cognition.push(0);
        img6.src="pic/wrong_w.png";
        r6 = '\n -> 答錯原因：MAR單認知錯誤<br>從目前的病患資訊，<font style="color: #228de5;">病人沒有臨床證據使用Peace的適應症</font>，應向醫師或專科護理師確認<br> <font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上<font style="background-color: yellow;">有服用該藥物的適應症</font></font>';
        // r6 = '您給 Peace 2.5mg/tab 的理由：' + document.getElementById('Peace 2.5mg/tab r').value;
        document.getElementById('6 r 6').innerHTML = r6;
        correctness.push(0);
        reason.push(document.getElementById('Peace 2.5mg/tab r').value);
    
    }


    // 7 
    var img7 = document.getElementById('7 img');
    r7r = ''
    if (!document.getElementById('check6').checked){
        c7r = ''
        r7r = ''
        r7r = '您不給 Oxacillin 1000mg/vail 的理由：' + document.getElementById('Oxacillin 1000mg/vail r no').value;
        reason.push(document.getElementById('Oxacillin 1000mg/vail r no').value);
        cognition.push(1);
        if (1==1){
            score = score + 1;
            img7.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img7.src="pic/wrong_w.png";
            // r7r = r7r + '\n -> 答錯原因：實際給藥錯誤';
            r7r = ' -> 答錯原因：實際給藥錯誤';
            correctness.push(0);
        }

        document.getElementById('7 r 7').innerHTML = r7r;
    }else{
        cognition.push(0);
        img7.src="pic/wrong_w.png";
        r7 = '您給 Oxacillin 1000mg/vail 的理由：' + document.getElementById('Oxacillin 1000mg/vail r').value;
        document.getElementById('7 r').innerHTML = r7;
        // r7 = r7 + '\n -> 答錯原因：MAR單認知錯誤';
        correctness.push(0);
        reason.push(document.getElementById('Oxacillin 1000mg/vail r').value);
    }

    // 8
    var img8 = document.getElementById('8 img');
    r8 = ''
    if (document.getElementById('check8').checked){
        c8r = ''
        r8r = ''
        // r8 = '您給 Paramol 500mg/tab 的理由：' + document.getElementById('Paramol 500mg/tab r').value;
        reason.push(document.getElementById('Paramol 500mg/tab r').value);
        cognition.push(1);
        if (pill_detect['Paramol'] == 1){
            score = score + 1;
            img8.src="pic/ok_w.png";
            c8r = '你是最棒的!ㄥ'
            correctness.push(1);

        }else{
            img8.src="pic/wrong_w.png";
            // r8 = r8 + '\n -> 答錯原因：實際給藥錯誤';
            r8r = ' -> 答錯原因：實際給藥錯誤<br>病人有腹痛，懷孕用藥分級屬於B (通常安全)<br><font style="color: #f44336;">★ <font style="background-color: yellow;">給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>，並且執行給藥醫囑</font>';
            correctness.push(0);
        }
        document.getElementById('8 r').innerHTML = c8r;
        document.getElementById('8 r 8').innerHTML = r8r;
    }else{
        cognition.push(0);
        img8.src="pic/wrong_w.png";
        // r8r = '您不給 Paramol 500mg/tab 的理由：' + document.getElementById('Paramol 500mg/tab r').value;
        r8r = ' -> 答錯原因：MAR單認知錯誤<br>病人有腹痛，懷孕用藥分級屬於B (通常安全)<br><font style="color: #f44336;">★ <font style="background-color: yellow;">給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>，並且執行給藥醫囑</font>';
        document.getElementById('8 r 8').innerHTML = r8r;
        // r8r = r8r + '\n -> 答錯原因：MAR單認知錯誤'
        correctness.push(0);
        reason.push(document.getElementById('Paramol 500mg/tab r no').value);
    }


    // 9
    var img9 = document.getElementById('9 img');
    
    if (document.getElementById('check7').checked){
        c9r = ''
        r9r = ''
        // r9r = '您給 Primperan 5 mg/tab 的理由：' + document.getElementById('Primperan 5 mg/tab r').value;
        reason.push(document.getElementById('Primperan 5 mg/tab r').value);
        cognition.push(1);
        if (pill_detect['Primperan'] == 1){ 
            score = score + 1;
            img9.src="pic/ok_w.png";
            c9r = '答對了，請繼續保持'
            correctness.push(1);

        }else{
            img9.src="pic/wrong_w.png";
            r9r = '\n -> 答錯原因：實際給藥錯誤<br>病人有嘔吐，懷孕用藥分級屬於B(通常安全)<br><font style="color: #f44336;">★ <font style="background-color: yellow;">給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>，並且執行給藥醫囑</font>';
            correctness.push(0);
        }
        document.getElementById('9 r').innerHTML = c9r;
        document.getElementById('9 r 9').innerHTML = r9r;
    }else{
        cognition.push(0);
        img9.src="pic/wrong_w.png";
        // r9 = '您不給 Primperan 5 mg/tab 的理由：' + document.getElementById('Primperan 5 mg/tab r no').value;
        r9 ='\n -> 答錯原因：MAR單認知錯誤<br>病人有嘔吐，懷孕用藥分級屬於B(通常安全)<br><font style="color: #f44336;">★ <font style="background-color: yellow;">給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>，並且執行給藥醫囑</font>';
        document.getElementById('9 r 9').innerHTML = r9;
        correctness.push(0);
        reason.push(document.getElementById('Primperan 5 mg/tab r no').value);
    
    }


    // 10
    // var img10 = document.getElementById('10 img');
    
    // if (!document.getElementById('check8').checked){
    //     r10r = '您不給 Sandimmun neoral 100mg/tab 的理由：' + document.getElementById('Sandimmun neoral 100mg/tab r no').value;
    //     reason.push(document.getElementById('Sandimmun neoral 100mg/tab r no').value);
    //     cognition.push(1);
    //     if (pill_detect['Sandimmunneoral'] == 0){
    //         score = score + 1;
    //         img10.src="pic/ok_w.png";
    //         correctness.push(1);

    //     }else{
    //         img10.src="pic/wrong_w.png";
    //         r10r = r10r + '\n -> 答錯原因：實際給藥錯誤';
    //         correctness.push(0);
    //     }

    //     document.getElementById('10 r 10').innerHTML = r10r;
    // }else{
    //     cognition.push(0);
    //     img10.src="pic/wrong_w.png";
    //     r10 = '您給 Sandimmun neoral 100mg/tab 的理由：' + document.getElementById('Sandimmun neoral 100mg/tab r').value;
    //     document.getElementById('10 r').innerHTML = r10;
    //     correctness.push(1);
    //     reason.push(document.getElementById('Sandimmun neoral 100mg/tab r').value);
    // }

    
    // score
    document.getElementById('score').innerHTML = score;
    if (score >= 7)
    {
        document.getElementById('review').innerHTML = '高等';
    }else if(score >= 4)
    {
        document.getElementById('review').innerHTML = '中等';
    }else
    {
        document.getElementById('review').innerHTML = '低等';
    }

}   