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
        // paitent_r = '掃描結果：' + $('.ODF_value')[0].innerText + ',   您判斷是否正確： Yes';
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
        // r2r = '您不給 Concor 5mg/tab 的理由：' + document.getElementById('Concor 5mg/tab r no').value;
        reason.push(document.getElementById('Anpo 10mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Lanpo 30mg/tab'] == 0 && pill_detect['Apno 30mg/tab'] == 0 ){ 
            score = score + 1;
            img2.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img2.src="pic/wrong_w.png";
            r2r = '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('2 r 2').innerHTML = r2r;

    }else{
        cognition.push(0);
        img2.src="pic/wrong_w.png";
        r2 = '您給 Anpo 10mg/tab 的理由：' + document.getElementById('Anpo 10mg/tab r').value;
        document.getElementById('2 r').innerHTML = r2;
        correctness.push(0);
        reason.push(document.getElementById('Anpo 10mg/tab r').value);
    
    }
    
    // 3
    var img3 = document.getElementById('3 img');
    r3r = ''
    if (document.getElementById('check2').checked){
        r3r = '您不給 Progesterone 25mg/ml 的理由：' + document.getElementById('Progesterone 25mg/ml r no').value;
        reason.push(document.getElementById('Progesterone 25mg/ml r no').value);
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
        reason.push(document.getElementById('Progesterone 25mg/ml r').value);
    }


    // 4
    var img4 = document.getElementById('4 img');
    r4r = ''
    if (!document.getElementById('check3').checked){
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
        // r5r = '您不給 Sennoside 12mg/tab 的理由：' + document.getElementById('Sennoside 12mg/tab r no').value;
        reason.push(document.getElementById('Sennoside 12mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Sennoside'] == 0){ 
            score = score + 1;
            img5.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img5.src="pic/wrong_w.png";
            r5r = '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('5 r 5').innerHTML = r5r;

    }else{
        cognition.push(0);
        img5.src="pic/wrong_w.png";
        r5 = '您給 Sennoside 12mg/tab 的理由：' + document.getElementById('Sennoside 12mg/tab r').value;
        document.getElementById('5 r').innerHTML = r5;
        correctness.push(0);
        reason.push(document.getElementById('Sennoside 12mg/tab r').value);
    
    }


    // 6
    var img6 = document.getElementById('6 img');
    
    if (!document.getElementById('check5').checked){
        // r6r = '您不給 Peace 2.5mg/tab 的理由：' + document.getElementById('Peace 2.5mg/tab r no').value;
        reason.push(document.getElementById('Peace 2.5mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Peace'] == 0){ 
            score = score + 1;
            img6.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img6.src="pic/wrong_w.png";
            r6r = '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);

        }
        document.getElementById('6 r 6').innerHTML = r6r;

    }else{
        cognition.push(0);
        img6.src="pic/wrong_w.png";
        r6 = '您給 Peace 2.5mg/tab 的理由：' + document.getElementById('Peace 2.5mg/tab r').value;
        document.getElementById('6 r').innerHTML = r6;
        correctness.push(0);
        reason.push(document.getElementById('Peace 2.5mg/tab r').value);
    
    }


    // 7 
    var img7 = document.getElementById('7 img');
    r7r = ''
    if (!document.getElementById('check6').checked){
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
        r7 = r7 + '\n -> 答錯原因：MAR單認知錯誤';
        correctness.push(0);
        reason.push(document.getElementById('Oxacillin 1000mg/vail r').value);
    }

    // 8
    var img8 = document.getElementById('8 img');
    r8 = ''
    if (document.getElementById('check8').checked){
        // r8 = '您給 Paramol 500mg/tab 的理由：' + document.getElementById('Paramol 500mg/tab r').value;
        reason.push(document.getElementById('Paramol 500mg/tab r').value);
        cognition.push(1);
        if (pill_detect['Paramol'] == 1){
            score = score + 1;
            img8.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img8.src="pic/wrong_w.png";
            // r8 = r8 + '\n -> 答錯原因：實際給藥錯誤';
            r8 = ' -> 答錯原因：實際給藥錯誤';
            correctness.push(0);
        }

        document.getElementById('8 r').innerHTML = r8;
    }else{
        cognition.push(0);
        img8.src="pic/wrong_w.png";
        r8r = '您不給 Paramol 500mg/tab 的理由：' + document.getElementById('Paramol 500mg/tab r').value;
        document.getElementById('8 r 8').innerHTML = r8r;
        r8r = r8r + '\n -> 答錯原因：MAR單認知錯誤'
        correctness.push(0);
        reason.push(document.getElementById('Paramol 500mg/tab r no').value);
    }


    // 9
    var img9 = document.getElementById('9 img');
    
    if (document.getElementById('check7').checked){
        // r9r = '您給 Primperan 5 mg/tab 的理由：' + document.getElementById('Primperan 5 mg/tab r').value;
        reason.push(document.getElementById('Primperan 5 mg/tab r').value);
        cognition.push(1);
        if (pill_detect['Primperan'] == 1){ 
            score = score + 1;
            img9.src="pic/ok_w.png";
            correctness.push(1);

        }else{
            img9.src="pic/wrong_w.png";
            r9r = '\n -> 答錯原因：實際給藥錯誤';
            correctness.push(0);
        }

        document.getElementById('9 r 9').innerHTML = r9r;
    }else{
        cognition.push(0);
        img9.src="pic/wrong_w.png";
        r9 = '您不給 Primperan 5 mg/tab 的理由：' + document.getElementById('Primperan 5 mg/tab r no').value;
        document.getElementById('9 r').innerHTML = r9;
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