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

  selectedMission: any = null;

  constructor() { }

  // Methode zum Überprüfen, ob alle Missionen abgeschlossen sind
  allMissionsCompleted(): boolean {
    return this.missions.every((mission) => mission.completed);
  }

  // Methode, um das Rad zu drehen
  spinWheel() {
    const availableMissions = this.missions.filter((mission) => !mission.completed);
    if (availableMissions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMissions.length);
      this.selectedMission = availableMissions[randomIndex];
    } else {
      this.selectedMission = null;
    }
  }

  // Methode, um eine Mission zu markieren
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


