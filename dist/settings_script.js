define(["require", "exports", "d3", "./main", "./util"], function (require, exports, d3, main_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.settings_setup = () => {
        console.log('setting up settings_setup');
        let dropdown = d3
            .select('#button_panel')
            .append('div')
            .attr('id', 'settings_dropdown');
        let slider_scroller = dropdown.append('div').attr('id', 'settings_slider_scroller');
        dropdown
            .append('div')
            .attr('class', 'settings_slider_box')
            .style('height', '40px')
            .style('background-color', 'rgb(100,100,100)')
            .append('button')
            .attr('id', 'settings_restore_defaults_button')
            .style('visibility', 'hidden')
            .text('Restore defaults')
            .on('click', restore_defaults);
        //add_slider_box(slider_scroller,"settings_range_node_repulsion","Physics: node repulsion")
        //add_slider_box(slider_scroller,"settings_range_link_distance","Physics: link distance")
        //add_slider_box(slider_scroller,"settings_range_link_strength","Physics: link strength")
        //add_slider_box(slider_scroller,"settings_range_gravity","Physics: gravity")
        add_slider_box(slider_scroller, 'settings_range_node_size', 'Layout: node size');
        add_slider_box(slider_scroller, 'settings_range_node_opacity', 'Layout: node opacity');
        add_slider_box(slider_scroller, 'settings_range_background_color', 'Layout: background color');
        //add_slider_box(slider_scroller,"settings_range_edge_color","Layout: edge color")
        //add_slider_box(slider_scroller,"settings_range_edge_thickness","Layout: edge thickness")
        add_slider_box(slider_scroller, 'settings_range_edge_opacity', 'Layout: edge opacity');
        //d3.select("#settings").on("mouseenter", expand_settings);
        d3.select('#settings').on('click', exports.toggle_settings);
        d3.select('#settings_range_node_repulsion')
            .attr('min', 0)
            .attr('max', 300)
            .attr('value', 50)
            .on('input', function () {
            node_repulsion_change(this.value);
        });
        d3.select('#settings_range_link_distance')
            .attr('min', 0)
            .attr('max', 500)
            .attr('value', 40)
            .on('input', function () {
            link_distance_change(this.value);
        });
        d3.select('#settings_range_link_strength')
            .attr('min', 0)
            .attr('max', 100)
            .attr('value', 20)
            .on('input', function () {
            link_strength_change(this.value);
        });
        d3.select('#settings_range_gravity')
            .attr('min', 0)
            .attr('max', 40)
            .attr('value', 5)
            .on('input', function () {
            gravity_change(this.value);
        });
        d3.select('#settings_range_node_size')
            .attr('min', 0)
            .attr('max', 200)
            .attr('value', 50)
            .on('input', function () {
            node_size_change(this.value);
        });
        d3.select('#settings_range_node_opacity')
            .attr('min', 0)
            .attr('max', 100)
            .attr('value', 80)
            .on('input', function () {
            node_opacity_change(this.value);
        });
        d3.select('#settings_range_background_color')
            .attr('min', 0)
            .attr('max', 255)
            .attr('value', 220)
            .on('input', function () {
            background_color_change(this.value);
        });
        d3.select('#settings_range_edge_color')
            .attr('min', 0)
            .attr('max', 255)
            .attr('value', 100)
            .on('input', function () {
            edge_color_change(this.value);
        });
        d3.selectAll('.link line').attr('stroke-width', 1.2);
        d3.select('#settings_range_edge_thickness')
            .attr('min', 0)
            .attr('max', 800)
            .attr('value', 120)
            .on('input', function () {
            edge_thickness_change(this.value);
        });
        d3.select('#settings_range_edge_opacity')
            .attr('min', 0)
            .attr('max', 100)
            .attr('value', 50)
            .on('input', function () {
            edge_opacity_change(this.value);
        });
        d3.select('#quick_dark')
            .select('button')
            .on('click', function () {
            d3.select('#settings_range_background_color').node().value = '20';
            background_color_change('20');
        });
        d3.select('#quick_light')
            .select('button')
            .on('click', function () {
            d3.select('#settings_range_background_color').node().value = '220';
            background_color_change('220');
        });
        function node_repulsion_change(val) {
            main_1.forceLayout.force.force('repulsion', d3.forceManyBody().strength(-val / 10));
            main_1.forceLayout.force.restart();
        }
        function link_distance_change(val) {
            main_1.forceLayout.force.force('linkDistance', d3.forceLink().strength(val / 10));
            main_1.forceLayout.force.restart();
        }
        function link_strength_change(val) {
            main_1.forceLayout.force.force('linkDistance', d3.forceLink().strength(val / 10));
            main_1.forceLayout.force.restart();
        }
        function gravity_change(val) {
            main_1.forceLayout.force.force('gravity', d3.forceY(val));
            main_1.forceLayout.force.tick();
        }
        function check_any_selected() {
            let any_selected = false;
            for (let i = 0; i < main_1.forceLayout.all_outlines.length; i++) {
                if (main_1.forceLayout.all_outlines[i].selected) {
                    any_selected = true;
                }
            }
            return any_selected;
        }
        function node_size_change(val) {
            val = Math.pow((val / 50), 2.5) * 50 * (32 / util_1.SPRITE_IMG_WIDTH);
            let any_selected = check_any_selected();
            for (let i = 0; i < main_1.forceLayout.all_nodes.length; i++) {
                if (!any_selected || main_1.forceLayout.all_outlines[i].selected) {
                    main_1.forceLayout.all_nodes[i].scale.set(val / 100);
                    main_1.forceLayout.all_outlines[i].scale.set(val / 100);
                }
            }
        }
        function node_opacity_change(val) {
            let any_selected = check_any_selected();
            for (let i = 0; i < main_1.forceLayout.all_nodes.length; i++) {
                if (!any_selected || main_1.forceLayout.all_outlines[i].selected) {
                    main_1.forceLayout.all_nodes[i].alpha = val / 100;
                    if (main_1.forceLayout.all_outlines[i].selected || main_1.forceLayout.all_outlines[i].compared) {
                        main_1.forceLayout.all_outlines[i].alpha = val / 100;
                    }
                }
            }
        }
        function background_color_change(val) {
            const parsedVal = parseInt(val, 10);
            main_1.forceLayout.app.renderer.backgroundColor = parseInt(util_1.rgbToHex(parsedVal, parsedVal, parsedVal), 16);
            /*
                if (val < 125) {
                    text_anos.ba.style.fill = '#B8B8B8';
                } else {
                    text_anos.ba.style.fill = '#303030';
                }
                */
        }
        function edge_color_change(val) {
            return;
        }
        function edge_thickness_change(val) {
            d3.selectAll('.link line').attr('stroke-width', val / 100);
        }
        function edge_opacity_change(val) {
            main_1.forceLayout.edge_container.alpha = val / 100;
        }
        function rgb_string(val) {
            return 'rgb(' + val.toString() + ',' + val.toString() + ',' + val.toString() + ')';
        }
        function add_slider_box(host, id, name) {
            let slider_box = host.append('div').attr('class', 'settings_slider_box');
            slider_box
                .append('input')
                .attr('type', 'range')
                .attr('id', id);
            slider_box.append('p').text(name);
        }
        function restore_defaults() {
            /*
                document.getElementById("settings_range_node_repulsion").value = 50;
                node_repulsion_change(50);
        
                document.getElementById("settings_range_link_distance").value = 40;
                link_distance_change(40);
        
                document.getElementById("settings_range_link_strength").value = 20;
                link_strength_change(20);
        
                document.getElementById("settings_range_gravity").value = 5;
                gravity_change(5);
                */
            document.getElementById('settings_range_node_size').value = 50;
            node_size_change(50);
            document.getElementById('settings_range_node_opacity').value = 80;
            node_opacity_change(80);
            document.getElementById('settings_range_background_color').value = 220;
            background_color_change(220);
            //document.getElementById("settings_range_edge_color").value = 100;
            //edge_color_change(100);
            //document.getElementById("settings_range_edge_thickness").value = 120;
            //edge_thickness_change(120);
            document.getElementById('settings_range_edge_opacity').value = 50;
            edge_opacity_change(50);
        }
    };
    exports.toggle_settings = () => {
        if (d3.select('#settings_dropdown').style('visibility') === 'hidden') {
            exports.expand_settings();
        }
        else {
            exports.collapse_settings();
        }
    };
    exports.expand_settings = () => {
        main_1.forceLayout.closeDropdown();
        if (d3.select('#settings_dropdown').style('visibility') === 'hidden') {
            setTimeout(function () {
                d3.select('#settings_dropdown').style('height', '275px');
                d3.select('#settings_dropdown').style('visibility', 'visible');
                d3.select('#settings_restore_defaults_button').style('visibility', 'visible');
            }, 5);
        }
    };
    exports.collapse_settings = () => {
        if (parseInt(d3
            .select('#settings_dropdown')
            .style('height')
            .split('px')[0], 10) > 200) {
            main_1.forceLayout.closeDropdown();
            d3.select('#settings_dropdown').style('height', '0px');
            d3.select('#settings_restore_defaults_button').style('visibility', 'hidden');
            d3.select('#settings_dropdown').style('visibility', 'hidden');
        }
    };
});