import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import   GeoJSON  from 'geojson';
import * as shpwrite from 'shp-write';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @ViewChild('mapElement') mapElement: ElementRef;
  @ViewChild('mapAll') mapAll: ElementRef;
  @ViewChild('mapCR') mapCR: ElementRef;
  @ViewChild('mapCRPD') mapCRPD: ElementRef;
  @ViewChild('mapPD') mapPD: ElementRef;
  @ViewChild('mapLP') mapLP: ElementRef;
  @ViewChild('mapHI') mapHI: ElementRef;
  @ViewChild('mapHD') mapHD: ElementRef;

  viewOnce: any = false;

  @ViewChild('mapElementByDate') mapElementByDate: ElementRef;
  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    mapboxgl.accessToken =  'pk.eyJ1IjoiYWF0cmVzaG1rIiwiYSI6ImNqcXl6NGJidzA4YzI0MnBvNnJsNzI2YWEifQ.NCLzymCBnu0mJs1WZBmuqQ';
    this.calYear();
   this.mapAllPubVillages();
//    this.mapByAnimal(this.selected);
     this.mapByCategory(this.selectedAll);
    // this.mapByCatCR(this.selectedCR);
    // this.mapByCatCRPD(this.selectedCRPD);
    // this.mapByCatPD(this.selectedPD);
    // this.mapByCatLP(this.selectedLP);
    // this.mapByCatHI(this.selectedHI);

  }


  selectedAll: any;
selectedCR: any;
selectedCRPD: any;
selectedPD: any;
selectedLP: any;
selectedHI: any;
selectedHD: any;
selected: any;

yearArr: any=[];
  calYear(){
    let year = new Date();
    for(let i=2015;i<year.getFullYear();i++){
      this.yearArr.push(i + '-' + (i+1));

    }
    this.selectedAll = this.yearArr[this.yearArr.length-1];
    this.selectedCR = this.yearArr[this.yearArr.length-1];
    this.selectedCRPD = this.yearArr[this.yearArr.length-1];
    this.selectedPD = this.yearArr[this.yearArr.length-1];
    this.selectedLP = this.yearArr[this.yearArr.length-1];
    this.selectedHI = this.yearArr[this.yearArr.length-1];
    this.selectedHD = this.yearArr[this.yearArr.length-1];
    this.selected =  this.yearArr[this.yearArr.length-1];
  }

  map:any;

//   mapByAnimal(projYear){
//     let data = projYear.split('-');
//     let rec: any[];
//     let record = this.wildService.getMapByAnimal(data[0], data[1]);
//     console.log(data[0],data[1]);
//     record.subscribe(res => {
//       console.log(res);
//       rec = res;
//       let resultY: any[] = Object.values(rec).reduce(function (r, a) {
//         r[a.HWC_ANIMAL] = r[a.HWC_ANIMAL] || [];
//         r[a.HWC_ANIMAL].push(a);
//         return r;
//     }, Object.create(null));
//     // console.log(resultY);
//     // console.log(Object.keys(resultY));
//     // console.log(Object.values(resultY));
//     let finalRes: any[] = Object.values(resultY);
//     let i=0;let j=0;
//     let animal: any ;

//     finalRes.forEach(element => {
//      animal =  GeoJSON.parse(element, {Point: ['HWC_LAT', 'HWC_LONG']})
//     mapLayer(animal, i++,Object.keys(resultY)[j++] );

//     });

//     });


//       let map = new mapboxgl.Map({
//         container: this.mapElement.nativeElement,

//         style: 'mapbox://styles/mapbox/streets-v11',
//         center: [76.50,12.00 ],
//         zoom: 8.5
//         });

//         let mapLayer = (layer,number,name)=>{
//         map.on('load', () =>  {
//           if(number<1){
//           map.addControl(new mapboxgl.NavigationControl());
//         }

//           var popup = new mapboxgl.Popup({
//             closeButton: false,
//             closeOnClick: false
//             });

//           // Crop Layer

//        let  animal = 'animal' + number;
//           map.addSource( animal, {
//             'type': 'geojson',
//             /*many types of data can be added, such as geojson, vector tiles or raster data*/
//             'data': layer
//           });
// let color = ['red', 'blue', 'green', 'grey', 'brown', 'violet','purple','orange','yellow','pink']
//             map.addLayer({
//               "type": 'circle',
//               "id": animal,
//               'source': animal,
//                 'paint': {
//                 'circle-color': color[number],
//                 'circle-radius': 3,
//             }
//             });


//           map.on('mouseenter', animal, (e)=> {
//             map.getCanvas().style.cursor = 'pointer';

//             var coordinates = e.features[0].geometry.coordinates.slice();
//             var description = e.features[0].properties;

//             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//               coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//             }

//             // Populate the popup and set its coordinates
//             // based on the feature found.
//             popup.setLngLat(coordinates)
//               .setHTML('<h5>'+description.HWC_ANIMAL +' Details</h5>'+
//               '<ul>' +
//               '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
//               '<li>WSID: <b>' + description.WSID + '</b></li>' +
//               '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
//               '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
//               '</ul>')
//               .addTo(map);
//             });

//             map.on('mouseleave', animal, () => {
//             map.getCanvas().style.cursor = '';
//             popup.remove();
//             });

//           });



//     }
//   //   let legendInfo: any = [{
//   //     animal:"Elephant",
//   //     color:  "red"
//   //   },{
//   //     animal:"",
//   //     color: "green"
//   //   },,{
//   //     animal:"Property Loss",
//   //     color: "blue"
//   //   },{
//   //     animal:"Livestock Predation",
//   //     color: "yellow"
//   //   },{
//   //     animal:"Human Injury",
//   //     color: "brown"
//   //   },
//   // {
//   //   animal:"Human Death",
//   //   color: "grey"
//   // }];
//   //   //
//   //   //'<div><p>' + quantile + '</p></div>'
//   //   let legend = document.getElementById('legend');
//   //   legendInfo.forEach(ele => {
//   //     legend.insertAdjacentHTML('beforeend',
//   //     '<div style="display:flex"><div style="background-color:'+ele.color+';width:10px;height:10px;margin: 5px;"></div><p>'+ele.cat+'</p></div>');
//   //   });

//   }

  mapAllPubVillages(){
    let record = this.wildService.getMapAllPub();
    record.subscribe(res => {
    console.log(res);


      let villages =  GeoJSON.parse(res, {Point: ['PB_LAT', 'PB_LONG']})
        console.log(villages);

        this.map = new mapboxgl.Map({
          container: this.mapElement.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });

          this.map.on('load', ()=>  {
            this.map.addControl(new mapboxgl.NavigationControl());

            this.map.addSource('villages', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': villages
            });

              this.map.addLayer({
                "type": 'circle',
                "id": 'clusters',
                'source': 'villages',
                  'paint': {
                  'circle-color': 'red',
                  'circle-radius': 3,
              }
              });

          var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

              this.map.on('mouseenter', 'clusters', (e)=> {
              // Change the cursor style as a UI indicator.
              this.map.getCanvas().style.cursor = 'pointer';

              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties;
             // console.log(coordinates);
              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates)
                .setHTML('<h5>Village Details</h5>'+
                '<ul>' +
                '<li>Village: <b>' + description.Village + '</b></li>' +
                '<li>Park: <b>' + description.PARK + '</b></li>' +
                '<li>Taluk: <b>' + description.TALUK + '</b></li>' +
                '<li>FA Name: <b>' + description.USER_NAME + '</b></li>' +
                '<li>Date: <b>' + description.PB_V_DATE.slice(0,10) + '</b></li>' +
                '</ul>')
                .addTo(this.map);
              });

              this.map.on('mouseleave', 'clusters', () => {
              this.map.getCanvas().style.cursor = '';
              popup.remove();
              });
            });

    });

    }

    catGeoJson: any;
    mapByCategory(projYear){
      let data = projYear.split('-');
      let rec: any[];
      let record = this.wildService.getMapByCategory(data[0], data[1]);

      record.subscribe(res => {

        rec = res;
        this.catGeoJson = GeoJSON.parse(rec, {Point: ['HWC_LAT', 'HWC_LONG']});
        console.log(this.catGeoJson);
        let resultY: any[] = Object.values(rec).reduce(function (r, a) {
          r[a.HWC_CAT] = r[a.HWC_CAT] || [];
          r[a.HWC_CAT].push(a);
          return r;
      }, Object.create(null));
      console.log(resultY);

      let len = Object.keys(resultY).length;
      let categories = Object.keys(resultY);

      let crGeoJson: any = [];
      let crpdGeoJson: any = [];
      let pdGeoJson: any = [];
      let lpGeoJson: any = [];
      let hiGeoJson: any = [];
      let hdGeoJson: any = [];


      for(let i=0;i<len;i++){
        if(Object.keys(resultY)[i]==='CR'){
          crGeoJson = GeoJSON.parse(Object.values(resultY)[i], {Point: ['HWC_LAT', 'HWC_LONG']});
        }
        else if(Object.keys(resultY)[i] == 'CRPD'){
          crpdGeoJson = GeoJSON.parse(Object.values(resultY)[i], {Point: ['HWC_LAT', 'HWC_LONG']});
        }
        else if(Object.keys(resultY)[i] == 'PD'){
          pdGeoJson = GeoJSON.parse(Object.values(resultY)[i], {Point: ['HWC_LAT', 'HWC_LONG']});
        }
        else if(Object.keys(resultY)[i] == 'LP'){
          lpGeoJson = GeoJSON.parse(Object.values(resultY)[i], {Point: ['HWC_LAT', 'HWC_LONG']});
        }
        else if(Object.keys(resultY)[i] == 'HI'){
          hiGeoJson = GeoJSON.parse(Object.values(resultY)[i],  {Point: ['HWC_LAT', 'HWC_LONG']});
        }
        else if(Object.keys(resultY)[i] == 'HD'){
          hdGeoJson = GeoJSON.parse(Object.values(resultY)[i],  {Point: ['HWC_LAT', 'HWC_LONG']});
        }
      }

      let map = new mapboxgl.Map({
        container: this.mapAll.nativeElement,

        style: 'mapbox://styles/mapbox/streets-v11',
        center: [76.50,12.00 ],
        zoom: 8.5
        });


        map.on('load', () =>  {
          map.addControl(new mapboxgl.NavigationControl());

          var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
            });

          // Crop Layer
          if(categories.includes("CR")){
          map.addSource('cr', {
            'type': 'geojson',
            /*many types of data can be added, such as geojson, vector tiles or raster data*/
            'data': crGeoJson
          });

            map.addLayer({
              "type": 'circle',
              "id": 'cr',
              'source': 'cr',
                'paint': {
                'circle-color': 'red',
                'circle-radius': 3,
            }
            });
            console.log(map.getCanvas());
          }
          map.on('mouseenter', 'cr', (e)=> {
            map.getCanvas().style.cursor = 'pointer';

            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates)
              .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
              '<ul>' +
              '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
              '<li>WSID: <b>' + description.WSID + '</b></li>' +
              '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
              '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
              '</ul>')
              .addTo(map);
            });

            map.on('mouseleave', 'cr', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
            });


            // Crop and Property Layer
            if(categories.includes("CRPD")){
            map.addSource('crpd', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': crpdGeoJson
            });

              map.addLayer({
                "type": 'circle',
                "id": 'crpd',
                'source': 'crpd',
                  'paint': {
                  'circle-color': 'green',
                  'circle-radius': 3,
              }
              });
            }

            map.on('mouseenter', 'crpd', (e)=> {
              map.getCanvas().style.cursor = 'pointer';

              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates)
                .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                '<ul>' +
                '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                '<li>WSID: <b>' + description.WSID + '</b></li>' +
                '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                '</ul>')
                .addTo(map);
              });

              map.on('mouseleave', 'crpd', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
              });


            // Property Layer
            if(categories.includes("PD")){
              map.addSource('pd', {
                'type': 'geojson',
                /*many types of data can be added, such as geojson, vector tiles or raster data*/
                'data': pdGeoJson
              });

                map.addLayer({
                  "type": 'circle',
                  "id": 'pd',
                  'source': 'pd',
                    'paint': {
                    'circle-color': 'blue',
                    'circle-radius': 3,
                }
                });
              }

              map.on('mouseenter', 'pd', (e)=> {
                map.getCanvas().style.cursor = 'pointer';

                var coordinates = e.features[0].geometry.coordinates.slice();
                var description = e.features[0].properties;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates)
                  .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                  '<ul>' +
                  '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                  '<li>WSID: <b>' + description.WSID + '</b></li>' +
                  '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                  '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                  '</ul>')
                  .addTo(map);
                });

                map.on('mouseleave', 'pd', () => {
                map.getCanvas().style.cursor = '';
                popup.remove();
                });


              // LiveStock Predation Layer
              if(categories.includes("LP")){
              map.addSource('lp', {
                  'type': 'geojson',
                  /*many types of data can be added, such as geojson, vector tiles or raster data*/
                  'data': lpGeoJson
                });

                  map.addLayer({
                    "type": 'circle',
                    "id": 'lp',
                    'source': 'lp',
                      'paint': {
                      'circle-color': 'yellow',
                      'circle-radius': 3,
                  }
                  });
                }

                map.on('mouseenter', 'lp', (e)=> {
                  map.getCanvas().style.cursor = 'pointer';

                  var coordinates = e.features[0].geometry.coordinates.slice();
                  var description = e.features[0].properties;

                  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                  }

                  // Populate the popup and set its coordinates
                  // based on the feature found.
                  popup.setLngLat(coordinates)
                    .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                    '<ul>' +
                    '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                    '<li>WSID: <b>' + description.WSID + '</b></li>' +
                    '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                    '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                    '</ul>')
                    .addTo(map);
                  });

                  map.on('mouseleave', 'lp', () => {
                  map.getCanvas().style.cursor = '';
                  popup.remove();
                  });


                // Human Injury Layer
                if(categories.includes("HI")){
                map.addSource('hi', {
                    'type': 'geojson',
                    /*many types of data can be added, such as geojson, vector tiles or raster data*/
                    'data': hiGeoJson
                  });

                    map.addLayer({
                      "type": 'circle',
                      "id": 'hi',
                      'source': 'hi',
                        'paint': {
                        'circle-color': 'brown',
                        'circle-radius': 3,
                    }
                    });
                  }
                  map.on('mouseenter', 'hi', (e)=> {
                    map.getCanvas().style.cursor = 'pointer';

                    var coordinates = e.features[0].geometry.coordinates.slice();
                    var description = e.features[0].properties;

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    // Populate the popup and set its coordinates
                    // based on the feature found.
                    popup.setLngLat(coordinates)
                      .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                      '<ul>' +
                      '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                      '<li>WSID: <b>' + description.WSID + '</b></li>' +
                      '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                      '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                      '</ul>')
                      .addTo(map);
                    });

                    map.on('mouseleave', 'hi', () => {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
                    });


                  // Human Death
                  if(categories.includes("HD")){
                    map.addSource('hd', {
                      'type': 'geojson',
                      /*many types of data can be added, such as geojson, vector tiles or raster data*/
                      'data': hdGeoJson
                    });

                      map.addLayer({
                        "type": 'circle',
                        "id": 'hd',
                        'source': 'hd',
                          'paint': {
                          'circle-color': 'rgb(26, 218, 176)',
                          'circle-radius': 3,
                      }
                      });
                    }

                    map.on('mouseenter', 'hd', (e)=> {
                      map.getCanvas().style.cursor = 'pointer';

                      var coordinates = e.features[0].geometry.coordinates.slice();
                      var description = e.features[0].properties;

                      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                      }

                      // Populate the popup and set its coordinates
                      // based on the feature found.
                      popup.setLngLat(coordinates)
                        .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                        '<ul>' +
                        '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                        '<li>WSID: <b>' + description.WSID + '</b></li>' +
                        '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                        '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                        '</ul>')
                        .addTo(map);
                      });

                      map.on('mouseleave', 'hd', () => {
                      map.getCanvas().style.cursor = '';
                      popup.remove();
                      });




    //    console.log(map.getSource('cr'));
          });

          let legendInfo: any = [{
            cat:"Crop Loss",
            color:  "red"
          },{
            cat:"Crop and Property Loss",
            color: "green"
          },,{
            cat:"Property Loss",
            color: "blue"
          },{
            cat:"Livestock Predation",
            color: "yellow"
          },{
            cat:"Human Injury",
            color: "brown"
          },
        {
          cat:"Human Death",
          color: "rgb(26, 218, 176)"
        }];
          //
          //'<div><p>' + quantile + '</p></div>'
          let legend = document.getElementById('legend');

          if(!this.viewOnce){
          legendInfo.forEach(ele => {
            legend.insertAdjacentHTML('beforeend',
            '<div style="display:flex"><div style="background-color:'+ele.color+';width:10px;height:10px;margin: 5px;"></div><p>'+ele.cat+'</p></div>');

          });
          this.viewOnce=true;
        }

      });
    }

    crGeoJson: any;
    mapByCatCR(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatCR(data[0], data[1]);
      console.log(data[0],data[1]);
      record.subscribe(res => {

        this.crGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        let map = new mapboxgl.Map({
          container: this.mapCR.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          map.on('load', ()=>  {
            map.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            map.addSource('cr', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.crGeoJson,

            });

              map.addLayer({
                "type": 'circle',
                "id": 'cr',
                'source': 'cr',
                  'paint': {
                  'circle-color': 'red',
                  'circle-radius': 3,
              },

              });

              console.log(map.getCanvas());

            map.on('mouseenter', 'cr', (e)=> {
              map.getCanvas().style.cursor = 'pointer';

              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates)
                .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                '<ul>' +
                '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                '<li>WSID: <b>' + description.WSID + '</b></li>' +
                '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                '</ul>')
                .addTo(map);
              });

              map.on('mouseleave', 'cr', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
              });

            });

      });
    }

    crpdGeoJson: any;
    mapByCatCRPD(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatCRPD(data[0], data[1]);
      console.log(data[0],data[1]);
      record.subscribe(res => {

        this.crpdGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        let map = new mapboxgl.Map({
          container: this.mapCRPD.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          map.on('load', ()=>  {
            map.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            map.addSource('crpd', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.crpdGeoJson
            });

              map.addLayer({
                "type": 'circle',
                "id": 'crpd',
                'source': 'crpd',
                  'paint': {
                  'circle-color': 'green',
                  'circle-radius': 3,
              }
              });

            map.on('mouseenter', 'crpd', (e)=> {
              map.getCanvas().style.cursor = 'pointer';

              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates)
                .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                '<ul>' +
                '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                '<li>WSID: <b>' + description.WSID + '</b></li>' +
                '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                '</ul>')
                .addTo(map);
              });

              map.on('mouseleave', 'crpd', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
              });

            });

      });
    }

    pdGeoJson: any;
    mapByCatPD(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatPD(data[0], data[1]);
      console.log(data[0],data[1]);
      record.subscribe(res => {

        this.pdGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        let map = new mapboxgl.Map({
          container: this.mapPD.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          map.on('load', ()=>  {
            map.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            map.addSource('pd', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.pdGeoJson
            });

              map.addLayer({
                "type": 'circle',
                "id": 'pd',
                'source': 'pd',
                  'paint': {
                  'circle-color': 'blue',
                  'circle-radius': 3,
              }
              });

            map.on('mouseenter', 'pd', (e)=> {
              map.getCanvas().style.cursor = 'pointer';

              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates)
                .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                '<ul>' +
                '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                '<li>WSID: <b>' + description.WSID + '</b></li>' +
                '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                '</ul>')
                .addTo(map);
              });

              map.on('mouseleave', 'pd', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
              });

            });

      });
    }

    lpGeoJson: any;
    mapByCatLP(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatLP(data[0], data[1]);
      console.log(data[0],data[1]);
      record.subscribe(res => {

        this.lpGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        let map = new mapboxgl.Map({
          container: this.mapLP.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          map.on('load', ()=>  {
            map.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            map.addSource('lp', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.lpGeoJson
            });

              map.addLayer({
                "type": 'circle',
                "id": 'lp',
                'source': 'lp',
                  'paint': {
                  'circle-color': 'yellow',
                  'circle-radius': 3,
              }
              });

            map.on('mouseenter', 'lp', (e)=> {
              map.getCanvas().style.cursor = 'pointer';

              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates)
                .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                '<ul>' +
                '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                '<li>WSID: <b>' + description.WSID + '</b></li>' +
                '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                '</ul>')
                .addTo(map);
              });

              map.on('mouseleave', 'lp', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
              });

            });

      });
    }

    hiGeoJson: any;
    mapByCatHI(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatHI(data[0], data[1]);
      console.log(data[0],data[1]);
      record.subscribe(res => {

        this.hiGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        let map = new mapboxgl.Map({
          container: this.mapHI.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          map.on('load', ()=>  {
            map.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            map.addSource('hi', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.hiGeoJson
            });

              map.addLayer({
                "type": 'circle',
                "id": 'hi',
                'source': 'hi',
                  'paint': {
                  'circle-color': 'brown',
                  'circle-radius': 3,
              }
              });

            map.on('mouseenter', 'hi', (e)=> {
              map.getCanvas().style.cursor = 'pointer';

              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates)
                .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                '<ul>' +
                '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                '<li>WSID: <b>' + description.WSID + '</b></li>' +
                '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                '</ul>')
                .addTo(map);
              });

              map.on('mouseleave', 'hi', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
              });

            });

      });
    }

    hdGeoJson: any;
    mapByCatHD(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatHD(data[0], data[1]);

      record.subscribe(res => {
        console.log(res);

        this.hdGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        let map = new mapboxgl.Map({
          container: this.mapHD.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          map.on('load', ()=>  {
            map.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });



            map.addSource('hd', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.hdGeoJson
            });

              map.addLayer({
                "type": 'circle',
                "id": 'hd',
                'source': 'hd',
                  'paint': {
                  'circle-color': 'rgb(26, 218, 176)',
                  'circle-radius': 3,
              }
              });

            map.on('mouseenter', 'hd', (e)=> {
              map.getCanvas().style.cursor = 'pointer';

              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties;

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates)
                .setHTML('<h5>'+description.HWC_CAT +' Details</h5>'+
                '<ul>' +
                '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
                '<li>WSID: <b>' + description.WSID + '</b></li>' +
                '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
                '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
                '</ul>')
                .addTo(map);
              });

              map.on('mouseleave', 'hd', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
              });

            });

      });
    }

    downloadShapeFile(data){
      // (optional) set names for feature types and zipped folder
      let options = {
        folder: 'myshapes',
        types: {
            point: 'mypoints',
            polygon: 'mypolygons',
            line: 'mylines'
        }
      }
      // a GeoJSON bridge for features
      shpwrite.download(data, options);
       }

}
