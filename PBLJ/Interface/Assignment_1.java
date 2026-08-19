package Interface;

interface Drivable {
    void drive();
}

class Vehicle {
    String brand;
    int speed;

    Vehicle() {
        System.out.println("This is a vehicle");
    }

    Vehicle(String brand, int speed) {
        this.brand = brand;
        this.speed = speed;
    }

    void move() {
        System.out.println("This vehicle moves");
    }
}

class Car extends Vehicle implements Drivable {
    int seats;
    @Override
    public void drive() {
        System.out.println("This car is drivable");
    }

    Car(int seats) {
        System.out.println("This Car has "+seats+" seats");
    }

    void display() {
        System.out.println("This is a display");
    }
}

public class Assignment_1 {
    public static void main() {
        Car c = new Car(4);
        c.move();
        c.display();
        c.drive();
    }
}
