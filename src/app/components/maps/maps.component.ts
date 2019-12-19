import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import   GeoJSON  from 'geojson';
import * as shpwrite from 'shp-write';
import * as tokml from 'tokml';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @ViewChild('mapElement') mapElement: ElementRef;
  @ViewChild('mapAnimal') mapAnimal: ElementRef;
  @ViewChild('mapFA') mapFA: ElementRef;
  @ViewChild('mapPubFA') mapPubFA: ElementRef;
  @ViewChild('mapAll') mapAll: ElementRef;
  @ViewChild('mapCR') mapCR: ElementRef;
  @ViewChild('mapCRPD') mapCRPD: ElementRef;
  @ViewChild('mapPD') mapPD: ElementRef;
  @ViewChild('mapLP') mapLP: ElementRef;
  @ViewChild('mapHI') mapHI: ElementRef;
  @ViewChild('mapHD') mapHD: ElementRef;

  viewOnce: any = false;
  viewOnceAnimal: any = false;
  viewOnceFA: any = false;
  viewOncePubFA: any = false;

  @ViewChild('mapElementByDate') mapElementByDate: ElementRef;
  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    mapboxgl.accessToken =  'pk.eyJ1IjoiYWF0cmVzaG1rIiwiYSI6ImNqcXl6NGJidzA4YzI0MnBvNnJsNzI2YWEifQ.NCLzymCBnu0mJs1WZBmuqQ';
    this.calYear();
     this.mapAllPubVillages();
    this.mapByAnimal(this.selected);
    this.mapByCategory(this.selectedAll);
     this.mapByFA(this.selectedFA);
     this.mapPubVilByProjYearByFA(this.selectedPubByDateByFA)

    // this.mapByCatCR(this.selectedCR);
    // this.mapByCatCRPD(this.selectedCRPD);
    // this.mapByCatPD(this.selectedPD);
    // this.mapByCatLP(this.selectedLP);
    // this.mapByCatHI(this.selectedHI);

  }

selectedFA: any;
  selectedAll: any;
selectedCR: any;
selectedCRPD: any;
selectedPD: any;
selectedLP: any;
selectedHI: any;
selectedHD: any;
selected: any;
selectedPubByDate: any;
selectedPubByDateByFA: any;

yearArr: any=[];
  calYear(){
    let year = new Date();
    let curYear = year.getFullYear();

    if(year.getMonth() >= 6)
      year.setFullYear(curYear+1);
    for(let i=2015;i<year.getFullYear();i++){
      this.yearArr.push(i + '-' + (i+1));

    }
    this.selectedFA = this.yearArr[this.yearArr.length-1];
    this.selectedAll = this.yearArr[this.yearArr.length-1];
    this.selectedCR = this.yearArr[this.yearArr.length-1];
    this.selectedCRPD = this.yearArr[this.yearArr.length-1];
    this.selectedPD = this.yearArr[this.yearArr.length-1];
    this.selectedLP = this.yearArr[this.yearArr.length-1];
    this.selectedHI = this.yearArr[this.yearArr.length-1];
    this.selectedHD = this.yearArr[this.yearArr.length-1];
    this.selected =  this.yearArr[this.yearArr.length-1];
    this.selectedPubByDate = this.yearArr[this.yearArr.length-1];
    this.selectedPubByDateByFA = this.yearArr[this.yearArr.length-1];

  }
  letters = '0123456789ABCDEF';
  color = '#';

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



faData: any = [];
faGeoJson: any;
  mapByFA(projYear){
    let data = projYear.split('-');
    let rec: any[];
    let record = this.wildService.getMapByFA(data[0], data[1]);
    let legendInfo: any =[];
    record.subscribe(res => {
      this.faData = res;
      console.log(this.faData);
      this.faGeoJson = GeoJSON.parse(this.faData, {Point: ['HWC_LAT', 'HWC_LONG']});
      let resultY: any[] = this.faData.reduce(function (r, a) {
        r[a.HWC_FIELD_ASST] = r[a.HWC_FIELD_ASST] || [];
        r[a.HWC_FIELD_ASST].push(a);
        return r;
    }, Object.create(null));

    console.log(Object.keys(resultY));

     let finalRes: any[] = Object.values(resultY);
    let i=0;let j=0;
    let fa: any ;
   // console.log(finalRes);
   let color: any ;

//  if(!(name in Object.keys(color))){
//   color[name] = this.makeRandomColor();
//   console.log(color[name]);
// }


    finalRes.forEach(element => {
     fa =  GeoJSON.parse(element, {Point: ['HWC_LAT', 'HWC_LONG']});
    color = this.getRandomColor();

    mapLayer(fa, i++, color );
 //   console.log(color);
   legendInfo.push({
     fa:Object.keys(resultY)[j++],
     color: color
   })

    });
console.log(legendInfo);
let legend = document.getElementById('legend2');
if(!this.viewOnceFA){
legendInfo.forEach(ele => {
  legend.insertAdjacentHTML('beforeend',
  '<div class="m-0 p-0" style="display:flex;"><div style="background-color:'+ele.color+';width:10px;height:10px;margin:5px"></div><p>'+ele.fa+'</p></div>');
});
this.viewOnceFA = true;
}
    });


      let map = new mapboxgl.Map({
        container: this.mapFA.nativeElement,

        style: 'mapbox://styles/mapbox/streets-v11',
        center: [76.50,12.00 ],
        zoom: 8.5
        });


    let mapLayer = (layer,number,color)=>{

      map.on('load', () =>  {
        if(number<1){
        map.addControl(new mapboxgl.NavigationControl());
      }

        var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
          });

        // Crop Layer

     let  fa = 'fa' + number;
        map.addSource( fa, {
          'type': 'geojson',
          /*many types of data can be added, such as geojson, vector tiles or raster data*/
          'data': layer
        });

        //
        //

        map.addLayer({
            "type": 'circle',
            "id": fa,
            'source': fa,
              'paint': {
              'circle-color': color,
              'circle-radius': 3,
          }
          });


        map.on('mouseenter', fa, (e)=> {
          map.getCanvas().style.cursor = 'pointer';

          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates)
            .setHTML('<h5>'+description.HWC_FIELD_ASST +' Details</h5>'+
            '<ul>' +
            '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
            '<li>WSID: <b>' + description.WSID + '</b></li>' +
            '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
            '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
            '<li>Date: <b>' + description.HWC_CAT + '</b></li>' +
            '</ul>')
            .addTo(map);
          });

          map.on('mouseleave', fa, () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
          });

        });



  }

//   //
//   //'<div><p>' + quantile + '</p></div>'


  }

  // mapPubVillagesByDate(){
  //     let record = this.wildService.getMapPubByDate(this.fromDate.formatted,this.toDate.formatted);
  //     record.subscribe(res => {

  //       let villages =  GeoJSON.parse(res, {Point: ['PB_LAT', 'PB_LONG']})


  //       this.map = new mapboxgl.Map({
  //         container: this.mapElementByDate.nativeElement,

  //         style: 'mapbox://styles/mapbox/streets-v11',
  //         center: [76.00,12.00 ],
  //         zoom: 7
  //         });

  //         this.map.on('load', ()=>  {
  //           this.map.addControl(new mapboxgl.NavigationControl());

  //           this.map.addSource('villages', {
  //             'type': 'geojson',
  //             /*many types of data can be added, such as geojson, vector tiles or raster data*/
  //             'data': villages
  //           });

  //             this.map.addLayer({
  //               "type": 'circle',
  //               "id": 'clusters',
  //               'source': 'villages',
  //                 'paint': {
  //                 'circle-color': 'red',
  //                 'circle-radius': 5,
  //             }
  //             });

  //         var popup = new mapboxgl.Popup({
  //             closeButton: false,
  //             closeOnClick: false
  //             });

  //             this.map.on('mouseenter', 'clusters', (e)=> {
  //             // Change the cursor style as a UI indicator.
  //             this.map.getCanvas().style.cursor = 'pointer';

  //             var coordinates = e.features[0].geometry.coordinates.slice();
  //             var description = e.features[0].properties;
  //           //
  //             // Ensure that if the map is zoomed out such that multiple
  //             // copies of the feature are visible, the popup appears
  //             // over the copy being pointed to.
  //             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  //               coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  //             }

  //             // Populate the popup and set its coordinates
  //             // based on the feature found.
  //             popup.setLngLat(coordinates)
  //               .setHTML('<h5>Village Details</h5>'+
  //               '<ul>' +
  //               '<li>Village: <b>' + description.Village + '</b></li>' +
  //               '<li>Park: <b>' + description.PARK + '</b></li>' +
  //               '<li>Taluk: <b>' + description.TALUK + '</b></li>' +
  //               '<li>FA Name: <b>' + description.USER_NAME + '</b></li>' +
  //               '<li>Date: <b>' + description.PB_V_DATE.slice(0,10) + '</b></li>' +
  //               '</ul>')
  //               .addTo(this.map);
  //             });

  //             this.map.on('mouseleave', 'clusters', () => {
  //             this.map.getCanvas().style.cursor = '';
  //             popup.remove();
  //             });
  //           });

  //     });
  //   }


  map:any;
animalGeoJson: any;
animalData: any = [];
  mapByAnimal(projYear){
    let data = projYear.split('-');
    let rec: any[];
    let record = this.wildService.getMapByAnimal(data[0], data[1]);

    record.subscribe(res => {

      rec = res;
      this.animalData = rec;
      this.animalGeoJson =  GeoJSON.parse(rec, {Point: ['HWC_LAT', 'HWC_LONG']})
      let resultY: any[] = rec.reduce(function (r, a) {
        r[a.HWC_ANIMAL] = r[a.HWC_ANIMAL] || [];
        r[a.HWC_ANIMAL].push(a);
        return r;
    }, Object.create(null));
    //

    //
    let finalRes: any[] = Object.values(resultY);
    let i=0;let j=0;
    let animal: any ;
    let legendInfo: any = [];
    let color: any;
    finalRes.forEach(element => {
     animal =  GeoJSON.parse(element, {Point: ['HWC_LAT', 'HWC_LONG']})
     color = this.getRandomColor();
     mapLayer(animal, i++, color);
    legendInfo.push({
      animal:Object.keys(resultY)[j++],
      color: color
    })

    });
    let legend = document.getElementById('legend1');
    if(!this.viewOnceAnimal){
    legendInfo.forEach(ele => {
      legend.insertAdjacentHTML('beforeend',
      '<div class="m-0 p-0" style="display:flex"><div style="background-color:'+ele.color+';width:10px;height:10px;margin:5px"></div><p>'+ele.animal+'</p></div>');
    });
    this.viewOnceAnimal = true;
  }

    });


      let map = new mapboxgl.Map({
        container: this.mapAnimal.nativeElement,

        style: 'mapbox://styles/mapbox/streets-v11',
        center: [76.50,12.00 ],
        zoom: 8.5
        });

        let mapLayer = (layer,number,color)=>{
        map.on('load', () =>  {
          if(number<1){
          map.addControl(new mapboxgl.NavigationControl());
        }

          var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
            });

          // Crop Layer

       let  animal = 'animal' + number;
          map.addSource( animal, {
            'type': 'geojson',
            /*many types of data can be added, such as geojson, vector tiles or raster data*/
            'data': layer
          });

          //
          //
          map.addLayer({
              "type": 'circle',
              "id": animal,
              'source': animal,
                'paint': {
                'circle-color': color,
                'circle-radius': 3,
            }
            });


          map.on('mouseenter', animal, (e)=> {
            map.getCanvas().style.cursor = 'pointer';

            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates)
              .setHTML('<h5>'+description.HWC_ANIMAL +' Details</h5>'+
              '<ul>' +
              '<li>Village: <b>' + description.HWC_VILLAGE + '</b></li>' +
              '<li>WSID: <b>' + description.WSID + '</b></li>' +
              '<li>Range: <b>' + description.HWC_RANGE + '</b></li>' +
              '<li>Date: <b>' + description.HWC_DATE.slice(0,10) + '</b></li>' +
              '</ul>')
              .addTo(map);
            });

            map.on('mouseleave', animal, () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
            });

          });



    }

  //   //
  //   //'<div><p>' + quantile + '</p></div>'

  }

xlsxReport(data, name) {
  this.excelService.exportAsExcelFile(data, name);
  return 'success';
}
pubVil: any = [];
pubVilGeoJson: any;
  mapAllPubVillages(){
    let record = this.wildService.getMapAllPub();
    record.subscribe(res => {

this.pubVil = res;

      let villages =  GeoJSON.parse(res, {Point: ['PB_LAT', 'PB_LONG']})

      this.pubVilGeoJson = villages;
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
             //
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
    hwcCat: any[];
    mapByCategory(projYear){
      let data = projYear.split('-');
      let rec: any[];
      let record = this.wildService.getMapByCategory(data[0], data[1]);

      record.subscribe(res => {

        this.hwcCat= res;
        this.catGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        let resultY: any[] = Object.values(this.hwcCat).reduce(function (r, a) {
          r[a.HWC_CAT] = r[a.HWC_CAT] || [];
          r[a.HWC_CAT].push(a);
          return r;
      }, Object.create(null));


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




    //
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
    mapcr: any;
    crCat: any;
    mapByCatCR(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatCR(data[0], data[1]);

      record.subscribe(res => {
        this.crCat = res;
        this.crGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        if(this.crGeoJson.features.length != 0 ){
         this.mapcr = new mapboxgl.Map({
          container: this.mapCR.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          this.mapcr.on('load', ()=>  {
            this.mapcr.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            this.mapcr.addSource('cr', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.crGeoJson,

            });

            this.mapcr.addLayer({
                "type": 'circle',
                "id": 'cr',
                'source': 'cr',
                  'paint': {
                  'circle-color': 'red',
                  'circle-radius': 3,
              },

              });



              this.mapcr.on('mouseenter', 'cr', (e)=> {
                this.mapcr.getCanvas().style.cursor = 'pointer';

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
                .addTo(this.mapcr);
              });

              this.mapcr.on('mouseleave', 'cr', () => {
                this.mapcr.getCanvas().style.cursor = '';
              popup.remove();
              });

            });
          }
      });
    }

    crpdGeoJson: any;
    mapcrpd: any;
    crpdCat: any;
    mapByCatCRPD(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatCRPD(data[0], data[1]);

      record.subscribe(res => {
        this.crpdCat = res;
        this.crpdGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        if(this.crpdGeoJson.features.length != 0){
         this.mapcrpd = new mapboxgl.Map({
          container: this.mapCRPD.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          this.mapcrpd.on('load', ()=>  {
            this.mapcrpd.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            this.mapcrpd.addSource('crpd', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.crpdGeoJson
            });

            this.mapcrpd.addLayer({
                "type": 'circle',
                "id": 'crpd',
                'source': 'crpd',
                  'paint': {
                  'circle-color': 'green',
                  'circle-radius': 3,
              }
              });

              this.mapcrpd.on('mouseenter', 'crpd', (e)=> {
                this.mapcrpd.getCanvas().style.cursor = 'pointer';

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
                .addTo(this.mapcrpd);
              });

              this.mapcrpd.on('mouseleave', 'crpd', () => {
                this.mapcrpd.getCanvas().style.cursor = '';
              popup.remove();
              });

            });
          }
      });
    }

    pdGeoJson: any;
    mappd: any;
    pdCat: any;
    mapByCatPD(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatPD(data[0], data[1]);

      record.subscribe(res => {
        this.pdCat = res;
        this.pdGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        if(this.mappd != undefined ){
          this.mappd.remove();
        }

        if(this.pdGeoJson.features.length != 0){
          this.mappd = new mapboxgl.Map({
          container: this.mapPD.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });
       //   this.Draw = mapboxgl.Draw();

       this.mappd.on('load', ()=>  {
        this.mappd.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            this.mappd.addSource('pd', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.pdGeoJson
            });

            this.mappd.addLayer({
                "type": 'circle',
                "id": 'pd',
                'source': 'pd',
                  'paint': {
                  'circle-color': 'blue',
                  'circle-radius': 3,
              }
              });

              this.mappd.on('mouseenter', 'pd', (e)=> {
                this.mappd.getCanvas().style.cursor = 'pointer';

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
                .addTo(this.mappd);
              });

              this.mappd.on('mouseleave', 'pd', () => {
                this.mappd.getCanvas().style.cursor = '';
              popup.remove();
              });

            });
          }
      });
    }

  //   expGeoJson(geodata) {
  //     // Extract GeoJson from featureGroup
  // //    var data = this.Draw.getAll();
  //       var data = geodata;
  //     if (data.features.length > 0) {
  //         // Stringify the GeoJson
  //         var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

  //         // Create export
  //         document.getElementById('export').setAttribute('href', 'data:' + convertedData);
  //         document.getElementById('export').setAttribute('download','data.geojson');
  //     } else {
  //         alert("Wouldn't you like to draw some data?");
  //     }

  // }

  saveToFile(content, filename) {
    var file = filename + '.geojson';
    saveAs(new File([JSON.stringify(content)], file, {
      type: "text/plain;charset=utf-8"
    }), file);
  }



    lpGeoJson: any;
    maplp:any;
    lpCat: any;
    mapByCatLP(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatLP(data[0], data[1]);

      record.subscribe(res => {
        this.lpCat = res;
        this.lpGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        if(this.maplp != undefined){
          this.maplp.remove();
        }

        if(this.lpGeoJson.features.length != 0 ){
         this.maplp = new mapboxgl.Map({
          container: this.mapLP.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          this.maplp.on('load', ()=>  {
            this.maplp.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            this.maplp.addSource('lp', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.lpGeoJson
            });

            this.maplp.addLayer({
                "type": 'circle',
                "id": 'lp',
                'source': 'lp',
                  'paint': {
                  'circle-color': 'yellow',
                  'circle-radius': 3,
              }
              });

              this.maplp.on('mouseenter', 'lp', (e)=> {
                this.maplp.getCanvas().style.cursor = 'pointer';

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
                .addTo(this.maplp);
              });

              this.maplp.on('mouseleave', 'lp', () => {
                this.maplp.getCanvas().style.cursor = '';
              popup.remove();
              });

            });
          }
      });
    }

    hiGeoJson: any;
    maphi: any;
    hiCat: any;
    mapByCatHI(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatHI(data[0], data[1]);

      record.subscribe(res => {
        this.hiCat= res;
        this.hiGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        if(this.maphi != undefined){
          this.maphi.remove();
        }

        if(this.hiGeoJson.features.length !=0){
        this.maphi = new mapboxgl.Map({
          container: this.mapHI.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          this.maphi.on('load', ()=>  {
            this.maphi.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            // Crop Layer

            this.maphi.addSource('hi', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.hiGeoJson
            });

            this.maphi.addLayer({
                "type": 'circle',
                "id": 'hi',
                'source': 'hi',
                  'paint': {
                  'circle-color': 'brown',
                  'circle-radius': 3,
              }
              });

              this.maphi.on('mouseenter', 'hi', (e)=> {
                this.maphi.getCanvas().style.cursor = 'pointer';

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
                .addTo(this.maphi);
              });

              this.maphi.on('mouseleave', 'hi', () => {
                this.maphi.getCanvas().style.cursor = '';
              popup.remove();
              });

            });
          }
      });
    }

    hdGeoJson: any;
    maphd:any;
    hdCat: any;
    mapByCatHD(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapByCatHD(data[0], data[1]);
    //  let map: any;
      record.subscribe(res => {

        this.hdCat = res;

console.log(this.hdCat);
        this.hdGeoJson = GeoJSON.parse(res, {Point: ['HWC_LAT', 'HWC_LONG']});

        if(this.maphd != undefined){
          this.maphd.remove();
        }

        if(this.hdGeoJson.features.length != 0){
          this.maphd = new mapboxgl.Map({
          container: this.mapHD.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.50,12.00 ],
          zoom: 8.5
          });


          this.maphd.on('load', ()=>  {
            this.maphd.addControl(new mapboxgl.NavigationControl());

            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });



              this.maphd.addSource('hd', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.hdGeoJson
            });

            this.maphd.addLayer({
                "type": 'circle',
                "id": 'hd',
                'source': 'hd',
                  'paint': {
                  'circle-color': 'rgb(26, 218, 176)',
                  'circle-radius': 3,
              }
              });
              console.log(this.maphd);
              //'rgb(26, 218, 176)',
              this.maphd.on('mouseenter', 'hd', (e)=> {
                this.maphd.getCanvas().style.cursor = 'pointer';

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
                .addTo(this.maphd);
              });

              this.maphd.on('mouseleave', 'hd', () => {
                this.maphd.getCanvas().style.cursor = '';
              popup.remove();
              });

            });
          }
      });
    }

    pubGeoJsonByProjYear: any;
    pubVilByProjYear: any = [];
    mapPubVilByProjYear(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapPubByDate(data[0], data[1]);
      record.subscribe(res => {
        this.pubVilByProjYear = res;
        this.pubGeoJsonByProjYear =  GeoJSON.parse(res, {Point: ['PB_LAT', 'PB_LONG']})


        let map = new mapboxgl.Map({
          container: this.mapElementByDate.nativeElement,

          style: 'mapbox://styles/mapbox/streets-v11',
          center: [76.00,12.00 ],
          zoom: 8.5
          });

          map.on('load', ()=>  {
            map.addControl(new mapboxgl.NavigationControl());

            map.addSource('villages', {
              'type': 'geojson',
              /*many types of data can be added, such as geojson, vector tiles or raster data*/
              'data': this.pubGeoJsonByProjYear
            });

              map.addLayer({
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

              map.on('mouseenter', 'clusters', (e)=> {
              // Change the cursor style as a UI indicator.
              map.getCanvas().style.cursor = 'pointer';

              var coordinates = e.features[0].geometry.coordinates.slice();
              var description = e.features[0].properties;
            //
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
                .addTo(map);
              });

              map.on('mouseleave', 'clusters', () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
              });
            });

      });
    }

    pubByProjYearByFA: any = [];

    mapPubVilByProjYearByFA(projYear){
      let data = projYear.split('-');
      let record = this.wildService.getMapPubByDate(data[0], data[1]);
      let legendInfo: any =[];
      record.subscribe(res => {
        console.log(res);

        this.pubByProjYearByFA = res;

        let resultY: any[] = this.pubByProjYearByFA.reduce(function (r, a) {
          r[a.USER_NAME] = r[a.USER_NAME] || [];
          r[a.USER_NAME].push(a);
          return r;
      }, Object.create(null));

      console.log(resultY);


      let finalRes: any[] = Object.values(resultY);
    let i=0;let j=0;
    let fa: any ;
   // console.log(finalRes);
   let color: any ;

    finalRes.forEach(element => {
     fa =  GeoJSON.parse(element, {Point: ['PB_LAT', 'PB_LONG']});
    color = this.getRandomColor();

    mapLayer(fa, i++, color );

   legendInfo.push({
     fa:Object.keys(resultY)[j++],
     color: color
   })

    });
console.log(legendInfo);
let legend = document.getElementById('legend3');
if(!this.viewOncePubFA){
legendInfo.forEach(ele => {
  legend.insertAdjacentHTML('beforeend',
  '<div class="m-0 p-0" style="display:flex;"><div style="background-color:'+ele.color+';width:10px;height:10px;margin:5px"></div><p>'+ele.fa+'</p></div>');
});
this.viewOncePubFA = true;
}
    });


      let map = new mapboxgl.Map({
        container: this.mapPubFA.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [76.50,12.00 ],
        zoom: 8.5
        });


    let mapLayer = (layer,number,color)=>{

      map.on('load', () =>  {
        if(number<1){
        map.addControl(new mapboxgl.NavigationControl());
      }

        var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
          });

        // Crop Layer

     let  fa = 'fa' + number;
        map.addSource( fa, {
          'type': 'geojson',
          /*many types of data can be added, such as geojson, vector tiles or raster data*/
          'data': layer
        });

        //
        //

        map.addLayer({
            "type": 'circle',
            "id": fa,
            'source': fa,
              'paint': {
              'circle-color': color,
              'circle-radius': 3,
          }
          });


        map.on('mouseenter', fa, (e)=> {
          map.getCanvas().style.cursor = 'pointer';

          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates)
            .setHTML('<h5>'+description.USER_NAME +' Details</h5>'+
            '<ul>' +
            '<li>Village: <b>' + description.Village + '</b></li>' +
            '<li>Park: <b>' + description.PARK + '</b></li>' +
            '<li>Taluk: <b>' + description.TALUK + '</b></li>' +
            '<li>Date: <b>' + description.PB_V_DATE.slice(0,10) + '</b></li>' +
            '</ul>')
            .addTo(map);
          });

          map.on('mouseleave', fa, () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
          });



      });
    }
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

       downloadKmlFile(data, name){
        var kmlNameDescription = tokml(data, {
          name: 'name',
          description: 'description'
      });
      this.saveAsKmlFile(kmlNameDescription,name)
       }

       private saveAsKmlFile(buffer: any, fileName: string): void {

        const data: Blob = new Blob([buffer]);
        saveAs(data, fileName + ".kml");
      }
}
