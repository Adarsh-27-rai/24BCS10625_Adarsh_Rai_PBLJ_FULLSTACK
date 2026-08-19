package Abstraction;

abstract  class Bank{
    private static int bal=2000;

    public static int getBal() {
        return bal;
    }

    public static void setBal(int balance) {
        bal = balance;
        System.out.println(bal);
    }
}

class SBI extends Bank{
    public void debit(int amount){
        int currentBalance=super.getBal();
        currentBalance -= amount;
        super.setBal(currentBalance);
    }
    public void credit(int amount){

    }
}

public class Abstract {
    public static void main(String[]args){
        SBI sbi=new SBI();
        sbi.debit(1000);
    }
}