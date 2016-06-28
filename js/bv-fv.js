$(window).ready(function () { // Declare nx global variables
    var applicationName = '3D bioviz'; //please provide a name for your application
    var clientInfo = 'calipho team with bioviz team';
    var nx = new Nextprot.Client(applicationName, clientInfo);
    var entry = nx.getEntryName();
    var isoform = entry + "-1";
    var sequence;

    // Declare bioviz global variables
    var biovizWidget;
    var identifier;
    var listMol;

    // Set bioviz options
    var bv_options = {
        startScript: false,
        structureToLoad: "",
        background: '#333333',
        pdbCustomUrl: nx.getApiBaseUrl() + "/pdb/${id}",
        height: "350"
    };
    // Set featureViewer options
    var fv_options = {
        showAxis: true,
        showSequence: true,
        brushActive: true,
        toolbar: true,
        bubbleHelp: true,
        zoomMax: 20
    };

    //Init FV styles and features
    var fvFeatures = [
        {
            "APIRef": "interacting-region",
            "metadata": {
                "name": "Interacting region",
                "className": "intregion",
                "color": "#B3C2F0",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "miscellaneous-region",
            "metadata": {
                "name": "Region",
                "className": "miscregion",
                "color": "#B3C2B3",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "domain",
            "metadata": {
                "name": "Domain",
                "className": "domain",
                "color": "#B3C2C2",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "repeat",
            "metadata": {
                "name": "Repeat",
                "className": "repeat",
                "color": "#98B7D5",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "calcium-binding-region",
            "metadata": {
                "name": "Calcium binding",
                "className": "calcium",
                "color": "#B3C2E1",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "zinc-finger-region",
            "metadata": {
                "name": "Zinc finger",
                "className": "calcium",
                "color": "#B3C2E1",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "dna-binding-region",
            "metadata": {
                "name": "DNA binding",
                "className": "dnabind",
                "color": "#B3C2FF",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "nucleotide-phosphate-binding-region",
            "metadata": {
                "name": "Nucleotide binding",
                "className": "nucleobind",
                "color": "#B3D1B3",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "coiled-coil-region",
            "metadata": {
                "name": "Coiled-coil",
                "className": "coiledcoil",
                "color": "#B3D1C2",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "short-sequence-motif",
            "metadata": {
                "name": "Sequence motif",
                "className": "motif",
                "color": "#B3D1D1",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "compositionally-biased-region",
            "metadata": {
                "name": "Composition bias",
                "className": "biased",
                "color": "#B3D1E1",
                "type": "rect",
                "filter": "Region"
            }
      },
        {
            "APIRef": "topological-domain",
            "metadata": {
                "name": "Top domain",
                "className": "topodomain",
                "color": "#A5DBA5",
                "type": "rect",
                "filter": "Topology"
            }
      },
        {
            "APIRef": "transmembrane-region",
            "metadata": {
                "name": "Membrane",
                "className": "membrane",
                "color": "#A5DBB7",
                "type": "rect",
                "filter": "Topology"
            }
      },
        {
            "APIRef": "miscellaneous-site",
            "metadata": {
                "name": "Site",
                "className": "site",
                "color": "#B3F0E1",
                "type": "unique",
                "filter": "Site"
            }
      },
        {
            "APIRef": "active-site",
            "metadata": {
                "name": "Active site",
                "className": "actSite",
                "color": "#B3F0F0",
                "type": "unique",
                "filter": "Site"
            }
      },
        {
            "APIRef": "binding-site",
            "metadata": {
                "name": "Binding site",
                "className": "bindsite",
                "color": "#82E6FF",
                "type": "unique",
                "filter": "Site"
            }
      },
        {
            "APIRef": "cleavage-site",
            "metadata": {
                "name": "Cleavage site",
                "className": "cleavsite",
                "color": "#B3FFB3",
                "type": "unique",
                "filter": "Site"
            }
      },
        {
            "APIRef": "metal-binding-site",
            "metadata": {
                "name": "Metal binding",
                "className": "metal",
                "color": "#B3FFC2",
                "type": "unique",
                "filter": "Site"
            }
      },
        {
            "APIRef": "variant",
            "metadata": {
                "name": "Variant",
                "className": "variant",
                "color": "rgba(0,255,154,0.3)",
                "type": "unique",
                "filter": "Variant"
            }
      },
        {
            "APIRef": "mutagenesis",
            "metadata": {
                "name": "Mutagenesis",
                "className": "mutagenesis",
                "color": "#73FFE3",
                "type": "unique",
                "filter": "Variant"
            }
      },
        {
            "APIRef": "sequence-conflict",
            "metadata": {
                "name": "Conflict",
                "className": "seqconflict",
                "color": "#6FFFFF",
                "type": "unique",
                "filter": "Conflict"
            }
      },
        {
            "APIRef": "beta-strand",
            "metadata": {
                "name": "Beta strand",
                "className": "betastrand",
                "color": "#B3F0C2",
                "type": "rect",
                "filter": "Secondary structure"
            }
      },
        {
            "APIRef": "helix",
            "metadata": {
                "name": "Helix",
                "className": "helix",
                "color": "#B3F0D1",
                "type": "rect",
                "filter": "Secondary structure"
            }
      },
        {
            "APIRef": "turn",
            "metadata": {
                "name": "Turn",
                "className": "turn",
                "color": "#B3F0E1",
                "type": "rect",
                "filter": "Secondary structure"
            }
      }
                 ];

    function init() {
        //Get identifiers

        $.getJSON("https://api.nextprot.org/entry/" + entry + "/identifier.json", function (data) {
            //        var firstPDBValue = null;
            var firstPDBValue = null;
            // Filter identifiers
            data.entry.identifiers.forEach(function (id) {
                if (id.type === "PDB") {
                    $('#pdbList').append($("<option></option>").val(id.name).html(id.name));
                    if (firstPDBValue == null) firstPDBValue = id.name;
                }
            });

            //                TEMPORAIRE :
            //        var firstPDBValue = "1A7F";

            if (firstPDBValue != null) {
                bv_options.structureToLoad = firstPDBValue;
                identifier = firstPDBValue;
                biovizWidget = $("#bioviz").bioviz(bv_options);

                // WAIT FOR BIOVIZ TO FINISH INITALIZATION (before interacting with it)
                biovizWidget.bioviz({
                    ready: function (event) {
                        nx.getProteinSequence(entry).then(function (data) {
                            sequence = data[0].sequence;
                            // ?? it's like the pdb hasnt finish to load, i have to do it with settimeout :
                            setTimeout(function () { getElement()}, 4000);
                            initMenuEvent();
                        })
                    }
                })
            }

            // Create FV
            nxFeatureViewer(nx, isoform, "#fv", fv_options)
                .then(function (ff) {
                    var apiCalls = fvFeatures.map(function (f) {
                        return f.APIRef
                    });
                    var styles = fvFeatures.map(function (f) {
                        return f.metadata
                    });
                    ff.addNxFeature(apiCalls, styles).then(function (ff) {
                        // Add click listener
                        ff.onFeatureSelected(function (d) {
                            selectionListener(d.detail);
                        });
                    })
                });
        });
    }

    function hideElem(elem) {
        var stringSelection = identifier + ":" + elem.type + ":" + elem.id;
        var ObjectSelection = biovizWidget.bioviz("getObjects3DFromSelection", stringSelection);
        biovizWidget.bioviz("hide", ObjectSelection);
    }

    function showElem(elem) {
        var stringSelection = identifier + ":" + elem.type + ":" + elem.id;
        var ObjectSelection = biovizWidget.bioviz("getObjects3DFromSelection", stringSelection);
        biovizWidget.bioviz("show", ObjectSelection, true);
    }

    function showOne(list, elem) {
        list.forEach(function (l) {
            if (l.id === elem) {
                showElem(l);
            } else hideElem(l);
        })

    }

    function showAll(list) {
        list.forEach(function (l) {
                showElem(l);
            })
            // with lower opacity ?
    }

    function getElement() {
        console.log("getElement");

        listMol = biovizWidget.bioviz("getMoleculesFromStructure", identifier).map(function (l) {
            return {
                type: l.type,
                id: l.id
            }
        });
        // First mol to be shown
        var firstElem = listMol[0];

        // Reset molList
        $("#molList").html("");

        // Add chain to input list and hide 3D object of chain !== firstElem
        listMol.forEach(function (m) {
            $('#molList').append($("<option></option>").val(m.id).html(m.type + " : " + m.id));
            if (m.id !== firstElem.id) {
                hideElem(m);
            }
        });
    }

    function initMenuEvent() {
        
        // If pdb identifier changes
        $("#pdbList").change(function (elem) {
            var accession = this.value;
            identifier = this.value;
            console.log('accession : ' + accession);
            var pdbDisplayed = biovizWidget.bioviz("getStructuresByPDBID");
            console.log("pdbDisplayed");
            console.log(pdbDisplayed);

            //Remove each of them
            pdbDisplayed.forEach(function (pdb) {
                biovizWidget.bioviz("deleteStructure", pdb);
            })

            //Display the new pdb
            biovizWidget.bioviz("loadStructure", accession);
            
            // Reload list of associated mol
            setTimeout(function () { getElement()}, 4000);
        });
        
        // If mol id changes
        $("#molList").change(function (elem) {
            var chain = this.value;
            showOne(listMol, chain);
            if ($("#showContext").prop("checked")) {
                $("#showContext").prop("checked", false);
            }
        })
        // If checkbox status to show context changes
        $("#showContext").change(function (e) {
                if (this.checked) {
                    showAll(listMol);
                } else {
                    var chain = $("#molList").val();
                    showOne(listMol, chain);
                }
            })
    }

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
            console.log("params : " + params);
            var selection = biovizWidget.bioviz("getObjects3DFromSelection", params);
            console.log("selection");
            console.log(selection);
            biovizWidget.bioviz("linkWithExternalSequence", selection, sequence);


            biovizWidget.bioviz("highlight", selection, true, null, range, true);
        })
    }

    function selectionListener(data) {
        console.log("testtt");
        console.log(data);
        var date = getFormattedDate();
        $("#eventTriggered").append("<li><span class='date'>" + date + "</span><span class='badge fv-badge'>FV</span> <strong> Start : </strong>" + data.start + " - <strong> End : </strong>" + data.end + "</li>");
        highlightFromRange([data.start, data.end]);
    }

    function getFormattedDate() {
        var date = new Date();
        var str = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return str;
    }


    init();
});