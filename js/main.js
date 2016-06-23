var applicationName = '3D bioviz'; //please provide a name for your application
var clientInfo = 'calipho team with bioviz team';
var nx = new Nextprot.Client(applicationName, clientInfo);
var entry = nx.getEntryName();


var biovizWidget;
var identifier;

var sequence;

var defaultPdb = "100D";
var insFirst = "1A7F";

// Set bioviz options
var options = {
    startScript: false,
    background: '#333333',
    pdbCustomUrl: nx.getApiBaseUrl() + "/pdb/${id}",
    height: "400"

};

$.getJSON("https://api.nextprot.org/entry/" + entry + "/identifier.json", function (data) {
    var firstPDBValue = null;
    data.entry.identifiers.forEach(function (id) {
        if (id.type === "PDB") {
            $('#pdbList').append($("<option></option>").val(id.name).html(id.name));
            if (firstPDBValue == null) firstPDBValue = id.name;
        }
    });
    if (firstPDBValue != null) {
        options.structureToLoad = firstPDBValue;
        identifier = firstPDBValue;
        biovizWidget = $("#bioviz").bioviz(options);
        $(".dots-loader").hide();

        // WAIT FOR BIOVIZ TO FINISH INITALIZATION (before interacting with it)
        biovizWidget.bioviz({
            ready: function (event) {
                console.log(event);
                nx.getProteinSequence(entry).then(function (data) {
                    console.log(data);
                    sequence = data[0].sequence;
                    activateButton();
                })
            }
        })


        //        TO get bioviz instance : 
        //        var api = biovizWidget.bioviz("getInstance");
        //        api.loadStructure();
        //        console.log(api);

    }
});


$("#pdbList").change(function (elem) {
    var accession = this.value;
    identifier = this.value;
    console.log('accession');
    console.log(accession);
    $("#gl").hide();
    $(".dots-loader").show();
    var pdbDisplayed = biovizWidget.bioviz("getStructuresByPDBID");
    console.log("pdbDisplayed");
    console.log(pdbDisplayed);

    //Remove each of them
    pdbDisplayed.forEach(function (pdb) {
        biovizWidget.bioviz("deleteStructure", pdb);
    })

    //Could be usefull :
    //    biovizWidget.bioviz('clearAllStructures')

    //Display the new pdb
    biovizWidget.bioviz("loadStructure", accession);

    $(".dots-loader").hide();
});

function highlightFromRange(range) {
    var listChains = biovizWidget.bioviz("getMoleculesFromStructure", identifier).map(function (l) {
        return {
            type: l.type,
            id: l.id
        }
    });
    console.log("listChains");
    console.log(listChains);

    biovizWidget.bioviz("resetHighlights");

    listChains.forEach(function (c) {
        var params = identifier + ":" + c.type + ":" + c.id;
        console.log("params");
        console.log(params);
        var selection = biovizWidget.bioviz("getObjects3DFromSelection", params);
        console.log(selection);
        biovizWidget.bioviz("linkWithExternalSequence", selection, sequence);


        biovizWidget.bioviz("highlight", selection, true, null, range, true);
    })
}


function activateButton() {
    $("#firstSelect").click(function () {
        var firstFeature = [33, 43];
        highlightFromRange(firstFeature);
    })
    $("#secondSelect").click(function () {
        var secondFeature = [91, 97];
        highlightFromRange(secondFeature);
    })
}

// Set bioviz options

//$(document).ready(function () {
//    // Launch bioviz app
//    biovizWidget = $("#bioviz").bioviz(options);
//});