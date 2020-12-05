$( function() {

    const apiUrl = '***apigatewayのurl***';
    const mode = "cors";
    
    
    $(document).ready(function() {
        // 初期処理を実装
        $('#button1').trigger('click');
    });
    
    $("#button1").click( function(){
        $("#status").text("データ取得中です");
        $.ajax(setAjaxInput('GET',createSendData('GET','','')))
             .done(function(data1,textStatus,jqXHR)  {
                $("#output").empty();
                $("#span1").text(jqXHR.status); //例：200
                let dlist = data1["body"];
    
                //取得データをmemoidでソート		
                dlist.sort(function(val1,val2){
                      var val1 = parseInt(val1.memoid);
                      var val2 = parseInt(val2.memoid);
                      if( val2 < val1) {
                        return 1;
                    } else {
                        return -1;
                    }
                   });
            
                //一覧表示
                for(var i in dlist){
                    $("#output").append("<li><div class='memoid'>"+  dlist[i].memoid + "</div><div class='detail'>"  + dlist[i].detail + "</div><img class='cancel' src='cancel.svg'></li>");
                }
    
                // JavaScriptオブジェクトをJSONに変換
                var data2 = JSON.stringify(data1);
                console.log(data2); //コンソールにJSONが表示される
    
            // 6. failは、通信に失敗した時に実行される
            }).fail(function(jqXHR, textStatus, errorThrown ) {
            // 7. alwaysは、成功/失敗に関わらず実行される
            }).always(function() {
                $("#status").text("complete");
            }
        );
    });
    
        $(document).on('click', ".cancel", function() {
            
            let  vmemoid = $(this).parent().find('.memoid').text();
                            
                $.ajax(setAjaxInput('DELETE',createSendData('DELETE',vmemoid,''))).
                    done(function(data1,textStatus,jqXHR) {
                        $('#button1').trigger('click');
                        $("#status").text("削除しました"); 
                    }).fail(function(jqXHR, textStatus, errorThrown ) {
                        $("#status").text("失敗しました"); }).
                    always(function() {
                    }
                );
        });
    
        $(document).on("click", ".detail", function() {
            
            if(!$(this).hasClass('on')){
                
                $(this).addClass('on');
                var txt = $(this).text();
                $(this).html('<input type="text" value="'+txt+'" />');
    
                $('.detail > input').focus().blur(function() {
                    var inputVal = $(this).val();
                    if(inputVal==='' || inputVal === this.defaultValue){
                        inputVal = this.defaultValue;
                    }
                    else{
                        let vmemoid = $(this).parent().parent().find('.memoid').text();	
                        console.log(setAjaxInput('PUT',createSendData('PUT',vmemoid,inputVal)));
                        
                        $.ajax(setAjaxInput('PUT',createSendData('PUT',vmemoid,inputVal))).
                            done(function(response,textStatus,jqXHR) {
                                console.log("成功:" + jqXHR.status);
    
                                if (response.body == 1)
                                {
                                    $('#button1').trigger('click');
                                    $("#status").text("登録しました"); 
                                }
                                else if(response.body  == -1)
                                {
                                    $("#status").text("サーバーの内部エラーのため登録が失敗しました。"); 
                                }
    
                             // 通信に失敗した時に実行される
                            }).fail(function(jqXHR, textStatus, errorThrown) {
                                alert("失敗:" + jqXHR.status);
                                console.log("失敗:" + jqXHR.status);
                            }
                        );
                    };
                    $(this).parent().removeClass('on').text(inputVal);
                });
            };
        });
    
        $('.add').on("click",function() {
    
            let value = $(".adddata").val();
    
            $.ajax(setAjaxInput('POST',createSendData('POST','',value))).
                done(function(response,textStatus,jqXHR){
                        console.log("成功:" + jqXHR.status);
    
                    if (response.body == 1)
                    {
                        $('#button1').trigger('click');
                        $("#status").text("登録しました"); 
                    }
                    else if(response.body  == -1)
                    {
                        $("#status").text("サーバーの内部エラーのため登録が失敗しました。"); 
                    }
                }).fail(function(jqXHR, textStatus, errorThrown){
                     alert("失敗:" + jqXHR.status);
                    console.log("失敗:" + jqXHR.status);
                }
            );
    
        });
    
        //send data
        const createSendData = (method,key,value) => {
            let sendData;
    
            if(method == "POST"){
                let dateyyyymmdd = getDate();
                sendData = JSON.stringify({
                                "detail": value ,
                                "date":   dateyyyymmdd ,
                                "sortindex": "1" ,
                                "userid": "1"
                            });
            }
            else if(method == "GET"){
                sendData = $("#form1").serialize();
            }
            else if(method == "DELETE"){
                sendData =	JSON.stringify({
                            "memoid":key
                            });
            }
            else if(method == "PUT"){
                let dateyyyymmdd = getDate();
                sendData = JSON.stringify({
                            "memoid": key,
                            "detail": value ,
                            "date":   dateyyyymmdd ,
                            "sortindex": "1" ,
                            "userid": "1"
                            });
            }
    
            return sendData;
        };
    
        //Ajax Send Input
        const setAjaxInput = (method,senddata) => {
            
            let ajaxObj ;
    
            ajaxObj = 
                {	
                    url:apiUrl, // 通信先のURL
                    type:method,// 使用するHTTPメソッド (GET/ POST)
                    mode:mode,
                    contentType: "application/json",
                    data:senddata, // 送信するデータ
                    dataType:'json', // 応答のデータの種類 (xml/html/script/json/jsonp/text)
                };
            return ajaxObj;
    
        };
    
        //yyyy/mm/dd　現在日付取得
        const getDate = () => {
            let dt = new Date();
            let y = dt.getFullYear();
            let m = ("00" + (dt.getMonth()+1)).slice(-2);
            let d = ("00" + dt.getDate()).slice(-2);
            let dateyyyymmdd = y + "/" + m + "/" + d;
            return dateyyyymmdd;
          };
    
    
    });