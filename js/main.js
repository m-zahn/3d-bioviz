var applicationName = '3D bioviz'; //please provide a name for your application
var clientInfo = 'calipho team with bioviz team';
var nx = new Nextprot.Client(applicationName, clientInfo);

function load(pdbId) {

    /*var url = 'http://www.rcsb.org/pdb/files/' + pdbId + '.pdb';
    if(nx.getEnvironment() !== "pro"){*/
    var url = nx.getApiBaseUrl() + "/pdb/" + pdbId;
    //}

}

$.getJSON("https://api.nextprot.org/entry/" + nx.getEntryName() + "/identifier.json", function (data) {
    var firstPDBValue = null;
    data.entry.identifiers.forEach(function (id) {
        if (id.type === "PDB") {
            $('#pdbList').append($("<option></option>").val(id.name).html(id.name));
            if (firstPDBValue == null) firstPDBValue = id.name;
        }
    });
    if (firstPDBValue != null) {
        $(".dots-loader").show();
        $("#gl").hide();
        viewer.on('viewerReady', load(firstPDBValue));
    } else {
        $('#pdbList').append($("<option></option>").val("N/A").html("N/A"));
        $(".dots-loader").hide();
    }
});


$("#pdbList").change(function (elem) {
    $("#gl").hide();
    $(".dots-loader").show();
    viewer.on('viewerReady', load(this.value));
});

var biovizWidget;

// Set bioviz options
var options = {
    structureToLoad: '4MMA'
};

$(document).ready(function () {
    // Launch bioviz app
    biovizWidget = $("#bioviz").bioviz(options);
});