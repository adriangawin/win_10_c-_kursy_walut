// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	var arrayDate = [];
	var output;
	var chosenDate = "";

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
				// TODO: This application has been newly launched. Initialize your application here.
			} else {
				// TODO: This application was suspended and then terminated.
			    // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
			    chosenDate = WinJS.Application.sessionState.previousDate;
			}
			args.setPromise(WinJS.UI.processAll());


			var getDatesButton = document.getElementById("getDatesButton");
			getDatesButton.addEventListener("click", getDatesButtonClicked, false);

			var closeApp = document.getElementById("closeApp");
			closeApp.addEventListener("click", closeAppClicked, false);

			var selectDate = document.getElementById("mySelect");
			selectDate.addEventListener("change", changeClicked, false);

			output = document.getElementById("output");

			getDatesButtonClicked();
		}
		
	};

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	function changeClicked(eventInfo) {
	    chosenDate = document.getElementById("mySelect").value;
	    //WinJS.Application.sessionState.previousDate = chosenDate;
	    showCurrentButtonClicked();
	}

	function closeAppClicked(enentInfo) {
	    window.close();
	}

	function buttonClickHandler(eventInfo) {
	    var userName = document.getElementById("nameInput").value;
	    var greetingString = "Hello, " + userName + " !";
	    document.getElementById("greetingOutput").innerHTML = greetingString;
	}

	function showCurrentButtonClicked(eventInfo) {
	    var bankURL = "http://www.nbp.pl/kursy/xml/" + chosenDate + ".xml";
	    WinJS.xhr({ url: bankURL, responseType: "xml" }).done(
            function complete(result) {
                var XMLobject = result.responseText;
                var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
                xmlDoc.loadXml(XMLobject);
                xmlDoc = xmlDoc.getElementsByTagName("pozycja");
                
                var template = "<table><tr><th>Nazwa waluty</th><th>Skrót</th><th>Prze</th><th>Wartosc</th></tr>";
                for (var i = 0; i < xmlDoc.length; i++) {
                    template += "<tr>";
                    var xmlDoc2 = xmlDoc.getAt(i).childNodes;
                    var string2 = "";
                    for (var j = 0; j < xmlDoc2.length; j++) {
                        if (j == 1 | j == 3 | j == 5 | j == 7) {
                            string2 += "<td>";
                            string2 += xmlDoc2.getAt(j).innerText;
                            string2 += "</td>";
                        }
                    }
                    xmlDoc2.forEach(function (elem) {
                        
                        
                    });
                    template += string2;
                    template += "</tr>";
                }
                template += "</table>";
                

                output.innerHTML = template;
            },
            function error(error) {

            },
            function progress(result) {

            }

        );
	}

	function getDatesButtonClicked(eventInfo) {
	    var bankURL = "http://www.nbp.pl/kursy/xml/dir.txt";
	    WinJS.xhr({ url: bankURL, responseType: "text" }).done(
            function complete(result) {
                output.innerHTML = "";
                var htmlOutput = "";
                var data = result.responseText.split("\n");
                if (chosenDate == "") {
                    chosenDate = data[data.length - 4];
                }
                
                //document.getElementById("test").innerHTML = currentDate;
                for (var i = data.length-1; i >= 0; i--) {
                    if (data[i].substr(0,1) == 'a'){
                        arrayDate.push(data[i]);
                        htmlOutput += '<option value="';
                        htmlOutput += data[i];
                        htmlOutput += '">';
                        htmlOutput += createDate(data[i]);
                        htmlOutput += "</select>"
                    }
                }
                //var htmlOutput = "";
                mySelect.innerHTML = htmlOutput;
                //output.innerHTML = "gotowe";
                showCurrentButtonClicked();
            },
            function error(error) {
                output.innerHTML = "Something went wrong...";
            }, 
            function progress(result) {
                output.innerHTML = "Please wait ...";
            }
        );
	}

	function createDate(data) {
	    return data.substr(9, 2) + "/" + data.substr(7, 2) + "/" + "20" + data.substr(5, 2);
	}


	app.start();
})();
