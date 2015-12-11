/*!
 * @filename	: QSelect ( wireframe.dc.dcv1.js )
 * @author		: BV, Kavyashree
 * @date		: 28-05-2014
 * 
 * It contains the workflow from product selection to till before
 * configuration.
 */

var qData = new Array();
    var qConfigData, selectedEPM;


    var elementCount, pagerCount, currentIndex, totalItemCount = 0;
    var showCount = 0;

    $(document).ready(function () {

    	
    	
       // alert("Screen Width:" + screen.width + "Screen Height:" + screen.height + "Window Width:" + $(window).width() + "Window Height:" + $(window).height());
        setContentPanelHeight();
        getQselectData();
        //alert(window.innerWidth);

        $(window).resize(function () {

            // alert($(window).width());

            setContentPanelHeight();
            setElementCount();
            createPager();

            if (currentIndex >= pagerCount) {

                currentIndex = currentIndex - 1;

            }

            showElements(currentIndex);

        });
    });


    function getQselectData() {

        $.getJSON('data/Qselect.json', function (qSelectData) {

            var keys = Object.keys(qSelectData);

            keys.forEach(function (key) {

                qData.push({ "shortDesc": key, "GroupHeader": true });

                if (qSelectData[key] instanceof Array) {

                    $.each(qSelectData[key], function (index, value) {
                        value['GroupName'] = key;
                        value['GroupHeader'] = false;
                        qData.push(value);
                    });

                }
            });

            init();
        });

    }





    function setContentPanelHeight() {

        $('#AddConfigProdContentDiv').height(window.innerHeight - $('#AddConfigProdHeader').height() - $('#AddConfigProdFooter').height() - 50);
        $('#qSelectDataContainer').height(window.innerHeight - $('#AddConfigProdHeader').height() - $('#AddConfigProdFooter').height() - 50);

        $('#quickConfigPopUp').height(window.innerHeight - $('#AddConfigProdHeader').height() - $('#AddConfigProdFooter').height() - 50);
        $('#quickConfigPopUp').width(window.innerWidth - 50);
        /* $('#qSelectDataContainer').attr('style',"background:yellow")*/


    }

    function setElementCount() {

        var rowCount, columnCount;

        rowCount = Math.floor($('#AddConfigProdContentDiv').height() / 55);



        var mq = window.matchMedia("(max-width:760px) and (orientation : portrait)");

        if (mq.matches) {

            columnCount = Math.round($('#AddConfigProdContentDiv').width() / 300);
            mq = false;
        }
        else {

            columnCount = Math.round($('#AddConfigProdContentDiv').width() / 350);
        }


        if (columnCount > 4) {

            columnCount = 4;

        }


        elementCount = rowCount * columnCount;



    }


    function createPager() {

        pagerCount = Math.ceil(qData.length / elementCount);



        $('#navigator').empty();

        for (var i = 0; i < pagerCount; i++) {

            $('#navigator').append('<a onclick="javascript:showElements(this.id)" id=' + i + '></a>');

        }

    }

    function showNext(e) {

        e.preventDefault();
        if (showCount < (pagerCount - 1))
            showElements(++showCount);
    }

    function showPrevious(e) {

        e.preventDefault();
        if (showCount > 0 && showCount <= pagerCount)
            showElements(--showCount);

    }


    function init() {

        setContentPanelHeight();
        setElementCount();
        createPager();
        showElements(0);


    }


    function showElements(pageIndex) {

        currentIndex = pageIndex;

        if (pageIndex >= 0 && pageIndex < pagerCount) {

            $('#qSelectDataContainer').empty();

            $('<ul>').attr({ 'data-role': 'listview', 'id': 'dataList', 'data-inset': "true", 'style': 'height:inherit', 'class': 'columns', 'data-split-icon': 'carat-d' }).appendTo('#qSelectDataContainer');

            var index = pageIndex * elementCount;
            var limit;

            if (elementCount > qData.length) {
                limit = qData.length
            }
            else {
                limit = index + elementCount;
            }


            for (var i = index; i < limit; i++) {

                if (i < qData.length)

                    if (qData[i].GroupHeader === true) {


                        $("#dataList").append('<li data-icon="false"  class="groupLabel"><a style="background: rgb(238, 238, 238);border:0px">' + qData[i].shortDesc + '</a></li>');

                    }
                    else {





                        if (qData[i].shortDesc === 'P1-Panelboard') {

                            //href="#quickConfigPopUp" data-rel="popup"
                            var data = JSON.stringify(qData[i]);
                            $("#dataList").append('<li data-icon="false"><a style=" border-bottom-left-radius: 1.500em;border-top-left-radius: 1.500em;border-bottom-right-radius: 0em;border-top-right-radius:0em;">' + qData[i].shortDesc + '</a><a onclick="showQConfigPopup(\'' + qData[i].productName + '\',\'' + qData[i].shortDesc + '\')" style="border-bottom-right-radius: 1.500em;border-top-right-radius: 1.500em;border-top-left-radius:0em;border-bottom-left-radius:0em;"></a></li>');
                        }
                        else {

                            $("#dataList").append('<li data-icon="false"><a>' + qData[i].shortDesc + '</a></li>');
                        }

                    }

            }


            $('#qSelectDataContainer').trigger('create');

            $(".activePage").removeClass("activePage");
            $('#' + pageIndex).addClass("activePage")


        }

    }


    /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                                                                       QuickConfig Region
    -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    function showQConfigPopup(prodName, prodDescription) {

        selectedEPM = { "productName": prodName, "shortDesc": prodDescription };
        $("#qConfigLeftContainer").empty();
        $("#qConfigRightContainer").empty();
        // $("#quickConfigPopUp").popup({ positionTo: "origin" }).popup("open");
        $("#quickConfigPopUp").popup("open");
        getQConfigData(selectedEPM.prd);


    }

    function exitQConfig() {
        $("#quickConfigPopUp").popup("close");
    }


    function getQConfigData(prod) {

        $.getJSON('data/QuickConfig.json', function (quickConfigData) {

            qConfigData = quickConfigData.EPM["userData"].Element;
            displayQconfigCstics(qConfigData.Cstic);

        });


    }

    function displayQconfigCstics(csticsList) {
        //console.log(csticsList);

        $.each(csticsList, function (index, cstic) {

            var $container = $('<div>', { "id": cstic.name, 'style': 'margin:20px' });


            var $csticLabel = $("<label>", { 'style': 'font-weight:bold;font-family: Arial;margin: 0.500em;color: rgb(129, 129, 129);' }).text(cstic.displayName);




            var $control;

            $container.append($csticLabel);

            switch (cstic.controlinfo) {

                case "RADIOB": $control = createRadioButton(cstic);
                    break;

                case "TABLE": if (cstic.Data) { $control = createTable(cstic.Data); }
                    break;

            }

            $('<div>').append($control).appendTo($container);

            if (cstic.displayName === "Select a Quick Configuration") {

                $container.appendTo("#qConfigLeftContainer");

            }
            else {

                $container.appendTo("#qConfigRightContainer");
            }

            $("#qConfigLeftContainer").trigger('create');
            $("#qConfigRightContainer").trigger('create');


        });


    }


    function createRadioButton(cstic) {

        var $radioContainer;


        if (cstic.Data.length > 2) {

            $radioContainer = $('<fieldset>', { "data-role": "controlgroup" }).append('<legend>');

            $.each(cstic.Data, function (index, controlValue) {

                $rb = $('<input>', { "type": "radio", "data-mini": "true", "id": controlValue.desc + 'RB', "value": controlValue.value, "name": cstic.displayName });

                if (controlValue.value === cstic.defaultValue) { $rb.attr("checked", true); }


                $rbLabel = $('<label>', { "for": controlValue.desc + 'RB' }).text(controlValue.desc);

                $radioContainer.append($rb).append($rbLabel);

            });

        }
        else {
            $radioContainer = $('<fieldset>', { "data-role": "controlgroup", "data-type": "horizontal" }).append('<legend>');

            $.each(cstic.Data, function (index, controlValue) {

                $rb = $('<input>', { "type": "radio", "data-mini": "true", "id": controlValue.desc + 'RB', "value": controlValue.value, "name": cstic.displayName });

                if (controlValue.value === cstic.defaultValue) { $rb.attr("checked", true); }


                $rbLabel = $('<label>', { "for": controlValue.desc + 'RB' }).text(controlValue.desc);
                $radioContainer.append($rb).append($rbLabel);

            });


        }

        return $('<form>').append($radioContainer);

    }

    function createTable(controlData) {


    }


    /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                                                                                        DC Configurator 
    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    function showDConfigPanel() {

        /*Hide QSelect Elements and show DC Elements*/

        //header
        $('#AddConfigProdHeader').hide();
        $('#dConfigHeader').show();
        $('#dcEPMnameLabel').text(selectedEPM.shortDesc);

        //Content
        $('#qSelectDataContainer').hide();
        $('#DConfigPanel').show();

        //Footer
        $('#navigator').hide();
        $('#dcFooterDiv').show();

        $("#quickConfigPopUp").popup("close");

        //window.location.href = "DataConfigurator.html";

    }