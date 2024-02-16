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
    
    if (radios[1].checked){
        cognition.push(1);
        score = score + 1;
        img1.src="pic/ok_w.png";
        paitent_r = '掃描結果：' + $('.ODF_value')[0].innerText + ',   您判斷是否正確： Yes';
        correctness.push(1);
    }else{
        cognition.push(0);
        img1.src="pic/wrong_w.png";
        paitent_r = '掃描結果：' + $('.ODF_value')[0].innerText + ',   您判斷是否正確： No';
        correctness.push(0);
    }
    
    document.getElementById('paitent r').innerHTML = paitent_r;


    // 2
    var img2 = document.getElementById('2 img');
    if (!document.getElementById('check1').checked){
        r2r = '您不給 Amiodarone(Cordarone) 150mg/3ml/amp 的理由：' + document.getElementById('Amiodarone(Cordarone) 150mg/3ml/amp r no').value;
        reason.push(document.getElementById('Amiodarone(Cordarone) 150mg/3ml/amp r no').value);
        cognition.push(1);
        if (1==1){ 
            score = score + 1;
            img2.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img2.src="pic/wrong_w.png";
            r2r = r2r + '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('2 r 2').innerHTML = r2r;

    }else{
        cognition.push(0);
        img2.src="pic/wrong_w.png";
        r2 = '您給 Amiodarone(Cordarone) 150mg/3ml/amp 的理由：' + document.getElementById('Amiodarone(Cordarone) 150mg/3ml/amp r').value;
        document.getElementById('2 r').innerHTML = r2;
        correctness.push(0);
        reason.push(document.getElementById('Amiodarone(Cordarone) 150mg/3ml/amp r').value);
    
    }
    
    // 3
    var img3 = document.getElementById('3 img');
     
    if (!document.getElementById('check6').checked){
        r3r = '您不給 Plavix (Clopidogrel) 75mg/tab 的理由：' + document.getElementById('Plavix (Clopidogrel) 75mg/tab r no').value;
        reason.push(document.getElementById('Plavix (Clopidogrel) 75mg/tab r no').value);
        cognition.push(1); // 實際藥物需要300mg 但實際藥丸只有225mg
        if (pill_detect['Plavix'] == 0){
            score = score + 1;
            img3.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img3.src="pic/wrong_w.png";
            r3r = r3r + '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('3 r 3').innerHTML = r3r;

    }else{
        cognition.push(0);
        img3.src="pic/wrong_w.png";
        r3 = '您給 Plavix (Clopidogrel) 75mg/tab 的理由：' + document.getElementById('Plavix (Clopidogrel) 75mg/tab r').value;
        document.getElementById('3 r').innerHTML = r3;
        r3 = r3 + '\n -> 答錯原因：MAR單認知錯誤';
        correctness.push(0);
        reason.push(document.getElementById('Plavix (Clopidogrel) 75mg/tab r').value);
    
    }


    // 4
    var img4 = document.getElementById('4 img');
    if (!document.getElementById('check2').checked){
        r4r = '您不給 KCL (Potassium chloride) 20mEq/10mL/amp 的理由：' + document.getElementById('KCL (Potassium chloride) 20mEq/10mL/amp r no').value;
        reason.push(document.getElementById('KCL (Potassium chloride) 20mEq/10mL/amp r no').value);
        cognition.push(1);
        if (1==1){ 
            score = score + 1;
            img4.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img4.src="pic/wrong_w.png";
            r4r = r4r + '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('4 r 4').innerHTML = r4r;

    }else{
        cognition.push(0);
        img4.src="pic/wrong_w.png";
        r4 = '您給 KCL (Potassium chloride) 20mEq/10mL/amp 的理由：' + document.getElementById('KCL (Potassium chloride) 20mEq/10mL/amp r').value;
        document.getElementById('4 r').innerHTML = r4;
        correctness.push(0);
        reason.push(document.getElementById('KCL (Potassium chloride) 20mEq/10mL/amp r').value);
    
    }


    // 5
    var img5 = document.getElementById('5 img');
    
    if (!document.getElementById('check4').checked){
        r5r = '您不給 Rolikan (Sodium bicarbonate) 7% 20mL/amp 的理由：' + document.getElementById('Rolikan (Sodium bicarbonate) 7% 20mL/amp r no').value;
        reason.push(document.getElementById('Rolikan (Sodium bicarbonate) 7% 20mL/amp r no').value);
        cognition.push(1);
        if (1==1){ 
            score = score + 1;
            img5.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img5.src="pic/wrong_w.png";
            r5r = r5r + '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('5 r 5').innerHTML = r5r;

    }else{
        cognition.push(0);
        img5.src="pic/wrong_w.png";
        r5 = '您給 Rolikan (Sodium bicarbonate) 7% 20mL/amp 的理由：' + document.getElementById('Rolikan (Sodium bicarbonate) 7% 20mL/amp r').value;
        document.getElementById('5 r').innerHTML = r5;
        correctness.push(0);
        reason.push(document.getElementById('Rolikan (Sodium bicarbonate) 7% 20mL/amp r').value);
    
    }


    // 6
    var img6 = document.getElementById('6 img');
    
    if (!document.getElementById('check3').checked){
        r6r = '您不給 Cefazolin 1000mg/vail 的理由：' + document.getElementById('Cefazolin 1000mg/vail r no').value;
        reason.push(document.getElementById('Cefazolin 1000mg/vail r no').value);
        cognition.push(1);
        if (1==1){ 
            score = score + 1;
            img6.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img6.src="pic/wrong_w.png";
            r6r = r6r + '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('6 r 6').innerHTML = r6r;

    }else{
        cognition.push(0);
        img6.src="pic/wrong_w.png";
        r6 = '您給 Cefazolin 1000mg/vail 的理由：' + document.getElementById('Cefazolin 1000mg/vail r').value;
        document.getElementById('6 r').innerHTML = r6;
        correctness.push(0);
        reason.push(document.getElementById('Cefazolin 1000mg/vail r').value);
    
    }


    // 7 
    var img7 = document.getElementById('7 img');

    if (!document.getElementById('check7').checked){
        r7r = '您不給 Aspirin 100mg/tab 的理由：' + document.getElementById('Aspirin 100mg/tab r no').value;
        reason.push(document.getElementById('Aspirin 100mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Aspirin'] == 0){
            score = score + 1;
            img6.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img7.src="pic/wrong_w.png";
            r7r = r7r + '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);
        }

        document.getElementById('7 r 7').innerHTML = r7r;
    }else{
        cognition.push(0);
        img7.src="pic/wrong_w.png";
        r7 = '您給 Aspirin 100mg/tab 的理由：' + document.getElementById('Aspirin 100mg/tab r').value;
        document.getElementById('7 r').innerHTML = r7;
        r7 = r7 + '\n -> 答錯原因：MAR單認知錯誤';
        correctness.push(0);
        reason.push(document.getElementById('Aspirin 100mg/tab r').value);
    }

    // 8
    var img8 = document.getElementById('8 img');
    
    if (document.getElementById('check8').checked){
        r8 = '您給 Tulip （Atorvastatin）20mg/tab 的理由：' + document.getElementById('Tulip （Atorvastatin）20mg/tab r').value;
        reason.push(document.getElementById('Tulip （Atorvastatin）20mg/tab r').value);
        cognition.push(1);
        if (pill_detect['Tulip'] == 1){
            score = score + 1;
            img8.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img8.src="pic/wrong_w.png";
            r8 = r8 + '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);
        }

        document.getElementById('8 r').innerHTML = r8;
    }else{
        cognition.push(0);
        img8.src="pic/wrong_w.png";
        r8r = '您不給 Tulip （Atorvastatin）20mg/tab 的理由：' + document.getElementById('Tulip （Atorvastatin）20mg/tab r').value;
        document.getElementById('8 r 8').innerHTML = r8r;
        r8r = r8r + '\n -> 答錯原因：MAR單認知錯誤'
        correctness.push(0);
        reason.push(document.getElementById('Tulip （Atorvastatin）20mg/tab r no').value);
    }


    // 9
    var img9 = document.getElementById('9 img');
    
    if (document.getElementById('check5').checked){
        r9r = '您給 Heparin 25000units/vail 的理由：' + document.getElementById('Heparin 25000units/vail r').value;
        reason.push(document.getElementById('Heparin 25000units/vail r').value);
        cognition.push(1);
        if (medicines['Heparin 25000units/vail']['verification']!=null && 0.75<=medicines['Heparin 25000units/vail']['injection'] && medicines['Heparin 25000units/vail']['injection']<=0.85 && medicines['Heparin 25000units/vail']['way'][0]=='IVP' && medicines['Heparin 25000units/vail']['dilution']=="0"){ 
            score = score + 1;
            img9.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img9.src="pic/wrong_w.png";
            r9r = r9r + '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('9 r 9').innerHTML = r9r;
        console.log(medicines['Heparin 25000units/vail']['verification']!=null);
        console.log(0.75<=medicines['Heparin 25000units/vail']['injection']<=0.85);
        console.log(medicines['Heparin 25000units/vail']['way']==['IVP']);
        console.log(medicines['Heparin 25000units/vail']['dilution']=="0");

    }else{
        cognition.push(0);
        img9.src="pic/wrong_w.png";
        r9 = '您不給 Heparin 25000units/vail 的理由：' + document.getElementById('Heparin 25000units/vail r no').value;
        document.getElementById('9 r').innerHTML = r9;
        correctness.push(0);
        reason.push(document.getElementById('Heparin 25000units/vail r no').value);
    
    }


    // 10
    // var img10 = document.getElementById('10 img');
    
    // if (!document.getElementById('check9').checked){
    //     r10r = '您不給 FLU-D (Fluconazole) 50mg/tab 的理由：' + document.getElementById('FLU-D (Fluconazole) 50mg/tab r no').value;
    //     reason.push(document.getElementById('FLU-D (Fluconazole) 50mg/tab r no').value);
    //     cognition.push(1);
    //     if (pill_detect['FLU'] == 0){
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
    //     r10 = '您給 FLU-D (Fluconazole) 50mg/tab 的理由：' + document.getElementById('FLU-D (Fluconazole) 50mg/tab r').value;
    //     document.getElementById('10 r').innerHTML = r10;
    //     correctness.push(1);
    //     reason.push(document.getElementById('FLU-D (Fluconazole) 50mg/tab r').value);
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