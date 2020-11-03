import { Component, OnInit, ViewChild } from '@angular/core';
import { Recepie } from '../../recepie.model';
import { Subscription, Subject } from 'rxjs';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController, IonItemSliding } from '@ionic/angular';
import { RecepiesService } from '../../recepies.service';
import { Ingredients } from 'src/app/ingredients/ingredients.model';
import { switchMap } from 'rxjs/operators';


function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);
  
  for(let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for(let offset = begin, i=0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, {type: contentType});
}



@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  recepie: Recepie = new Recepie(Math.random().toString(), "", "", 
  "",
  "",[], [], [],"","");
  recepieId: string;
  @ViewChild("f2", { static: false }) formTags: NgForm;
  @ViewChild("f3", { static: false }) formSteps: NgForm;
  recepiesSubject = new Subject<Recepie>();
  isLoading = false;
  //private placeSub: Subscription;
  ingredientImage: File;
  recepieImage: File;
  form:FormGroup;
  form1:FormGroup;
  changeImage = false;
  imageSub = new Subject<boolean>();
  slika1: string;
  slika: string;

  constructor(private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private recipesService: RecepiesService) {}

    ngOnInit() {
      this.route.paramMap.subscribe(paramMap => {
        if(!paramMap.has('recepieId')) {
          this.navCtrl.navigateBack('/recepies/tabs/all');
          return;
        }
        this.isLoading = true;
        this.recipesService.getRecepie(paramMap.get('recepieId'))
        .subscribe(recepie => {
          this.recepie = recepie;
          this.form = new FormGroup({
            name: new FormControl(null,{
              updateOn:'blur',
              validators:[Validators.required]
            }),
            amount: new FormControl(null, {
              updateOn:'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            }),
            
            image: new FormControl(null)
          });
    
          this.form1 = new FormGroup({
            title: new FormControl(recepie.title,{
              updateOn:'blur',
              validators:[Validators.required]
            }),
            description: new FormControl(recepie.description, {
              updateOn:'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            }),
            calories: new FormControl(recepie.calories,{
              updateOn:'blur',
              validators:[Validators.required]
            }),
            time: new FormControl(recepie.time, {
              updateOn:'blur',
              validators: [Validators.required]
            }),
            image: new FormControl(null)
          });
          this.isLoading = false;
          this.imageSub.next(this.changeImage);
          this.imageSub.subscribe(cImage => {
            this.changeImage = cImage;
          });
          console.log(recepie);
        }, error => {
          this.alertCtrl.create({header:'An error occurred', message:'Could not load recepies.',
        buttons:[{text:'Okay', handler: () => {
          this.router.navigate(['/recepies/tabs/my-recepies']);
        }}]}).then(alertEl => {
          alertEl.present();
        });
        });
      });        
    }

    onChangeImage() {
      this.imageSub.next(true);
    }

   
  
    onImagePicked(imageData: string | File) {
      let imageFile;
      if(typeof imageData === 'string') {
        try {
         imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg'); 
        } catch (error) {
          console.log(error);
          return;
        }
      }else {
        imageFile = imageData;
      }
      console.log(imageFile);
      this.recipesService.uploadImage(imageFile).subscribe(uploadedRes => {
        console.log(uploadedRes);
        this.slika1 = uploadedRes.imageUrl;
      })
    }

    onRecepieImagePicked(imageData: string | File) {
      let imageFile;
      if(typeof imageData === 'string') {
        try {
         imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg'); 
        } catch (error) {
          console.log(error);
          return;
        }
      }else {
        imageFile = imageData;
      }
      this.recipesService.uploadImage(imageFile).subscribe(uploadedRes => {
        console.log(uploadedRes);
        this.slika = uploadedRes.imageUrl;
      })
    }

   onCreateRecepie() {
      //this.router.navigateByUrl("recepies/tabs/my-recepies");
      if(this.changeImage) {
        
          return this.recipesService.updateRecepie(this.recepie.id, this.form1.get('title').value, this.form1.get('description').value,this.slika,
           this.recepie.ingredients, this.recepie.tags, this.recepie.steps,
           this.form1.get('calories').value, this.form1.get('time').value)
        .subscribe(() => {
            this.form1.reset();
            this.slika = null;
            this.router.navigateByUrl("recepies/tabs/my-recepies");
          });
      }else {
           this.recipesService.updateRecepie(this.recepie.id, this.form1.get('title').value, this.form1.get('description').value,this.recepie.imageUrl,
           this.recepie.ingredients, this.recepie.tags,this.recepie.steps,
           this.form1.get('calories').value, this.form1.get('time').value)
        .subscribe(() => {
            this.form1.reset();
            this.router.navigateByUrl("recepies/tabs/my-recepies");
          });
      }
    }

    addIngredient() {
      //let name = this.formIngredients.value['name'];
      //let amount = this.formIngredients.value['amount'];
      
      
        this.recepie.ingredients.push(new Ingredients(this.form.get('name').value,
         this.slika1,this.form.get('amount').value));
          this.recepiesSubject.next(this.recepie);
          this.form.reset();
          this.slika1 = null;
      
    }

    onDelete(name: string, slidingItem: IonItemSliding) {
      slidingItem.close();
      
      let ingredient = this.recepie.ingredients.filter(ing => {
        return name !== ing.name;
      });
      this.recepie.ingredients = ingredient;
      this.recepiesSubject.next(this.recepie);
    }

    addTag() {
      let tag = this.formTags.value['tag'];

      this.recepie.tags.push(tag);
        this.recepiesSubject.next(this.recepie);
        this.formTags.reset();
    }

    onDeleteTag(tag: string, slidingItem: IonItemSliding) {
      slidingItem.close();
      
      let newTags = this.recepie.tags.filter(tag1 => {
        return tag1 !== tag;
      });
      this.recepie.tags = newTags;
      this.recepiesSubject.next(this.recepie);
    }

    addStep() {
      let step = this.formSteps.value['step'];

      this.recepie.steps.push(step);
        this.recepiesSubject.next(this.recepie);
        this.formSteps.reset();
    }

    onDeleteStep(step: string, slidingItem: IonItemSliding) {
      slidingItem.close();
      
      let newSteps = this.recepie.steps.filter(step1 => {
        return step1 !== step;
      });
      this.recepie.steps = newSteps;
      this.recepiesSubject.next(this.recepie);
    }
}
