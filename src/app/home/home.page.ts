import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private startAngle: number = 0;
  private spinTimeout: any = null;
  private spinAngleStart: number = 10;
  private spinTime: number = 0;
  private spinTimeTotal: number = 0;

  // Rad 1 Missionen
  missions1: { title: string; description: string; taken: boolean }[] = [
    { title: 'Verstecke dich', description: 'Bleibe 3 Minuten versteckt, ohne gefunden zu werden. Du hast Max. 5 Minuten Zeit, um dich zu verstecken. Die Sucher tragen einen schwarzen Schleier vor der Maske.', taken: false },
    { title: 'Flaschenlauf', description: 'Stellt eine Flasche auf den Boden und treffe sie. Schießt du daneben, musst du zur Flasche rennen und sie berühren. Jeder hat einen Schuss frei während des Laufens. Das Spiel endet, wenn die Flasche getroffen wurde.', taken: false },
    { title: 'Burg Verteidigung', description: 'Verteidige alleine die Burg gegen die Angreifer! Jeder Angreifer hat 30 Schuss. Gewonnen ist das Spiel, wenn du alle Angreifer besiegt hast oder deren Munition alle ist. Du hast so viel Schuss, wie du tragen kannst!', taken: false },
    { title: 'Befreie die Prinzessin', description: 'In der Burg wurde deine Prinzessin verschleppt. Rette sie um jeden Preis. Die Verteidiger sind halb so viele wie die Angreifer. Stelle dein Team zusammen!', taken: false },
    { title: 'Duell', description: 'Gewinne ein Duell gegen einen anderen Spieler, den die anderen ausgesucht haben.', taken: false },
    { title: 'Bunnyhob', description: 'Spiele eine Runde mit zusammengebundenen Beinen.', taken: false },
    { title: 'Die Dame', description: 'Spiele eine Runde mit deiner Ersatzfrau. Sie darf während der Schlacht nicht getroffen werden.', taken: false },
    { title: 'Eskorte', description: 'Eskortiere deine Ersatzfrau zum Ausgang der Spielkarte, ohne dass sie getroffen wird oder in Feindeshände gerät.', taken: false },
  ];

  // Rad 2 Missionen (Optional für den Radwechsel)
  missions2: { title: string; description: string; taken: boolean }[] = [
    { title: 'Fotozeit', description: 'Mache ein Foto mit einem Fremden', taken: false },
    { title: 'Petetion', description: 'Sammel 5 Unterschriften von Frauen die auf deiner Begleitung unterschreiben', taken: false },
    { title: 'Wegweiser', description: 'Frage nach dem Weg und gehe dann in die andere Richtung', taken: false },
    { title: 'Gesangstalent', description: 'Singe mit allen Griechischer Wein die Musik kommt dabei aus dem Handy', taken: false },
    { title: 'Einen Ausgeben', description: 'Gebe jemand anderen in der Bar ein Glas Milch oder Wasser (ohne Kohlensäure) aus (dieser darf nicht aus der Gruppe sein)', taken: false },
    { title: 'Wo ist mein Telefon', description: 'Stelle dein Handy auf Laut. Gehe anschließend zu einer Person die dich anrufen soll weil du dein Handy verloren hast. Wenn dein Handy klingelt sage da ist es ja, bedanke dich und gehe', taken: false },
    { title: 'Alex 2', description: 'Jemanden suchen, der den gleichen Namen hat wie du und ein Foto mit ihm machen', taken: false },
  ];

  // Passivmissionen
  passiveMissions: { title: string; description: string }[] = [
    { title: 'Treuer Begleiter', description: 'Beschütze deinen Hund.' },
    { title: 'Epischer Tod', description: 'Sterbe einen epischen Tod.' },
    { title: 'Schlachtruf', description: 'Rufe etwas zum Start der Runde.' },
  ];

  // Aktuelle Missionsliste
  currentMissions = this.missions1;
  segments: string[] = this.currentMissions.map(mission => mission.title);
  arc: number = Math.PI / (this.segments.length / 2);
  winner: string | null = null;
  winnerDescription: string | null = null; // Beschreibung der gewonnenen Mission

  // Zustände
  isSpinning: boolean = false;
  showDialog: boolean = false;
  activePassiveMission: string | null = null; // Hervorgehobene passive Mission

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('wheel') as HTMLCanvasElement;
    if (!this.canvas) {
      console.error('Canvas-Element nicht gefunden.');
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('2D-Kontext konnte nicht erstellt werden.');
      return;
    }
    this.drawWheel();
  }

  private drawWheel(): void {
    if (!this.ctx || this.segments.length === 0) return;

    const outsideRadius = 140;
    const textRadius = 120;
    const insideRadius = 100;

    this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

    for (let i = 0; i < this.segments.length; i++) {
      const angle = this.startAngle + i * this.arc;
      this.ctx.fillStyle = this.getColor(i, this.segments.length);

      this.ctx.beginPath();
      this.ctx.arc(150, 150, outsideRadius, angle, angle + this.arc, false);
      this.ctx.arc(150, 150, insideRadius, angle + this.arc, angle, true);
      this.ctx.fill();

      this.ctx.save();
      this.ctx.fillStyle = 'white';
      this.ctx.translate(
        150 + Math.cos(angle + this.arc / 2) * textRadius,
        150 + Math.sin(angle + this.arc / 2) * textRadius
      );
      this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
      const text = this.segments[i];
      this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
      this.ctx.restore();
    }
  }

  spin(): void {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.spinAngleStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3000 + 4000;
    this.rotateWheel();
  }

  private rotateWheel(): void {
    this.spinTime += 30;

    if (this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel();
      return;
    }

    const spinAngle =
      this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
    this.startAngle += (spinAngle * Math.PI) / 180;
    this.drawWheel();

    this.spinTimeout = setTimeout(() => this.rotateWheel(), 30);
  }

  private stopRotateWheel(): void {
    clearTimeout(this.spinTimeout);

    const degrees = (this.startAngle * 180) / Math.PI + 90;
    const arcd = (this.arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd) % this.segments.length;

    this.winner = this.segments[index];
    const mission = this.currentMissions.find(m => m.title === this.winner);
    this.winnerDescription = mission?.description || null;
    this.showDialog = true;
    this.isSpinning = false;

    this.highlightPassiveMission(); // Passivmission hervorheben
  }

  acceptPrize(): void {
    if (this.winner) {
      const mission = this.currentMissions.find(mission => mission.title === this.winner);
      if (mission) mission.taken = true;

      this.segments = this.segments.filter(segment => segment !== this.winner);
      this.arc = Math.PI / (this.segments.length / 2);

      this.winner = null;
      this.winnerDescription = null;
      this.showDialog = false;
      this.drawWheel();
    }
  }

  declinePrize(): void {
    this.winner = null;
    this.winnerDescription = null;
    this.showDialog = false;
  }

  private highlightPassiveMission(): void {
    const randomIndex = Math.floor(Math.random() * this.passiveMissions.length);
    this.activePassiveMission = this.passiveMissions[randomIndex].title;
  }

  switchWheel(): void {
    this.currentMissions = this.currentMissions === this.missions1 ? this.missions2 : this.missions1;
    this.segments = this.currentMissions.map(mission => mission.title);
    this.arc = Math.PI / (this.segments.length / 2);
    this.drawWheel();
  }

  private getColor(item: number, maxItem: number): string {
    const hue = (item / maxItem) * 360;
    return `hsl(${hue}, 100%, 50%)`;
  }

  private easeOut(t: number, b: number, c: number, d: number): number {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }
}
