import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private segments: string[] = ['Preis 1', 'Preis 2', 'Preis 3', 'Preis 4'];
  private startAngle: number = 0;
  private arc: number = Math.PI / (this.segments.length / 2);
  private spinTimeout: any = null;
  private spinAngleStart: number = 10;
  private spinTime: number = 0;
  private spinTimeTotal: number = 0;

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('wheel') as HTMLCanvasElement;
    this.ctx = this.canvas!.getContext('2d');
    if (this.ctx) {
      this.drawWheel();
    }
  }


  private drawWheel(): void {
    if (!this.ctx) return;

    const outsideRadius = 140;
    const textRadius = 120;
    const insideRadius = 100;
    this.canvas = document.getElementById('wheel')! as HTMLCanvasElement;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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


  private getColor(item: number, maxItem: number): string {
    const hue = (item / maxItem) * 360;
    return `hsl(${hue}, 100%, 50%)`;
  }


  spin(): void {
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
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    const winningSegment = this.segments[index];
    alert(`Gewonnen: ${winningSegment}`);
  }


  private easeOut(t: number, b: number, c: number, d: number): number {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }
}