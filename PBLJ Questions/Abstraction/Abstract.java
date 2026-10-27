package Abstraction;

abstract class Bank{
    private static int balance = 1000;

    public static int getBalance(){
        return balance;
    }
    public static void setBalance(int val){
        balance = val;
    }
}

class Sbi extends Bank{
    public void debit(int bal){
        int currVal = super.getBalance();
        currVal -= bal;
        super.setBalance(currVal);
    }

    public void credit(int bal){
        int currVal = super.getBalance();
        currVal += bal;
        super.setBalance(currVal);

    }
}
public class Abstract {
    public static void main(String[] args) {
        Sbi s = new Sbi();
        s.debit(500);
        s.credit(1000);
        System.out.println(Sbi.getBalance());
    }
}