import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  missions = [
    { title: 'Drink a shot', completed: false },
    { title: 'Dance on a table', completed: false },
    { title: 'Sing a song', completed: false },
    { title: 'Take a selfie with a stranger', completed: false },
    { title: 'Collect 5 phone numbers', completed: false },
  ];

  sliceDegree: number = 0; // Winkel jedes Kuchenstücks
  rotation: number = 0; // Aktuelle Rotation des Rads
  currentRotation: number = 0; // Letzter Rotationsstatus
  isSpinning = false;
  selectedMission: any = null;

  constructor() {
    this.sliceDegree = 360 / this.missions.length; // Gleichmäßige Verteilung der Missionen
  }

  // Überprüfen, ob alle Missionen abgeschlossen sind
  allMissionsCompleted(): boolean {
    return this.missions.every((mission) => mission.completed);
  }

  // Funktion zum Drehen des Rads
  spinWheel() {
    if (this.isSpinning) return;

    this.isSpinning = true;

    const spins = 5; // Anzahl der vollen Umdrehungen
    const randomSlice = Math.floor(Math.random() * this.missions.length); // Zufällige Mission auswählen
    const randomDegree = spins * 360 + randomSlice * this.sliceDegree; // Berechnung der Gesamtrotation
    this.rotation = this.currentRotation + randomDegree; // Zur bisherigen Rotation hinzufügen

    setTimeout(() => {
      const selectedIndex = Math.floor(((360 - (this.rotation % 360)) / this.sliceDegree) % this.missions.length);
      this.selectedMission = this.missions[selectedIndex];
      this.currentRotation = this.rotation % 360; // Letzte Rotation speichern
      this.isSpinning = false;
    }, 4000); // Stoppe nach 4 Sekunden
  }

  // Markiere Mission als erfolgreich oder nicht erfolgreich
  markMission(successful: boolean) {
    if (successful && this.selectedMission) {
      const index = this.missions.findIndex(
        (mission) => mission.title === this.selectedMission.title
      );
      if (index !== -1) {
        this.missions[index].completed = true;
      }
    }
    this.selectedMission = null;
  }
}
