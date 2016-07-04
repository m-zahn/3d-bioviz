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
        background: '#333333',
        pdbCustomUrl: nx.getApiBaseUrl() + "/pdb/${id}",
        height: "350"
        // New option to avoid default representations
        // You then must set the representation of each chain you want
        // defaultRepresentations: false
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
                identifier = firstPDBValue;
                biovizWidget = $("#bioviz").bioviz(bv_options);

                // WAIT FOR BIOVIZ TO FINISH INITALIZATION (before interacting with it)
                biovizWidget.bioviz({
                    ready: function (event) {
                        nx.getProteinSequence(entry).then(function (data) {
                            sequence = data[0].sequence;

                            // Instead of using structureToLoad option with which you doesn't know when the structure is
                            // loaded, you better have to call API loadStructure method when BiovizJS is ready.

                            // Display the first pdb
                            var promise = biovizWidget.bioviz("loadStructure", firstPDBValue);

                            // Reload list of associated mol
                            promise.then(function () {
                                getElement();
                            }).catch(function(error) {
                                console.warn(error);
                            });

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
        var stringSelection = identifier + ":" + elem;
        var ObjectSelection = biovizWidget.bioviz("getObjects3DFromSelection", stringSelection);
        biovizWidget.bioviz("hide", ObjectSelection);
    }

    function showElem(elem) {
        var stringSelection = identifier + ":" + elem;
        var ObjectSelection = biovizWidget.bioviz("getObjects3DFromSelection", stringSelection);
        biovizWidget.bioviz("show", ObjectSelection, true);
    }

    // You can center and anchor on showed object, so it is centered on the scene and you rotate around it
    function centerElem(elem, duration) {
        var stringSelection = identifier + ":" + elem;
        var ObjectSelection = biovizWidget.bioviz("getObjects3DFromSelection", stringSelection);
        // When zooming (second parameter to true), you don't need to call anchorOnSelection method
        biovizWidget.bioviz("centerOnSelection", ObjectSelection, true, duration);
    }

    // Hide all chains of the current structure
    function hideAll() {
        var listMols = biovizWidget.bioviz("getMoleculesFromStructure", identifier).forEach(function(elem) {
            hideElem(elem);
        });
    }

    // Show all chains of the current structure
    function showAll(list) {
        var listMols = biovizWidget.bioviz("getMoleculesFromStructure", identifier).forEach(function(elem) {
            showElem(elem);
        });
        var ObjectSelection = biovizWidget.bioviz("getObjects3DFromSelection", identifier);
        // When zooming (second parameter to true), you don't need to call anchorOnSelection method
        biovizWidget.bioviz("centerOnSelection", ObjectSelection, true, 1000);
        // with lower opacity ?
    }

    function getElement() {
        console.log("getElement");

        // Retrieve proteinic chains of the structure
        listMol = biovizWidget.bioviz("getProteinicMoleculesFromStructure", identifier);

        // First mol to be shown
        var firstElem = listMol[0];

        // Reset molList
        $("#molList").html("");

        // Hide default representations and show only first item
        hideAll();
        showElem(firstElem);
        centerElem(firstElem);

        // Add chain to input list and hide 3D object of chain !== firstElem
        listMol.forEach(function (m) {
            $('#molList').append($("<option></option>").val(m).html(m));
        });
    }

    function initMenuEvent() {

        // If pdb identifier changes
        $("#pdbList").change(function (elem) {
            // Disable show context when loading a new file
            $("#showContext").prop('checked', false);

            var accession = this.value;
            identifier = this.value;
            console.log('accession : ' + accession);

            // Delete all structures contained by the scene
            biovizWidget.bioviz('deleteAllStructures');

            //Display the new pdb
            var promise = biovizWidget.bioviz("loadStructure", accession);

            // Reload list of associated mol
            promise.then(function () {
                getElement();
            }).catch(function(error) {
                console.warn(error);
            });
        });

        // If mol id changes
        $("#molList").change(function (elem) {
            hideAll();
            var chain = this.value;
            showElem(chain);
            centerElem(chain);
            if ($("#showContext").prop("checked")) {
                $("#showContext").prop("checked", false);
            }
        })
        // If checkbox status to show context changes
        $("#showContext").change(function (e) {
                if (this.checked) {
                    showAll(listMol);
                } else {
                    hideAll();

                    var chain = $("#molList").val();
                    showElem(chain);
                    centerElem(chain, 1000);
                }
            })
    }

    function highlightFromRange(range) {
        var listChains = biovizWidget.bioviz("getProteinicMoleculesFromStructure", identifier);
        console.log("listChains");
        console.log(listChains);

        biovizWidget.bioviz("resetHighlights");

        listChains.forEach(function (c) {
            var params = identifier + ":" + c;
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
