package ArrayList;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Scanner;

public class Warehouse {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<ArrayList<Integer>> products = new ArrayList<>();
        for(int i=0; i<3; i++) {
            products.add(new ArrayList<>());
            for(int j=0; j<3; j++) {
                int ch = sc.nextInt();
                products.get(i).add(ch);
            }
        }

        LinkedList<Integer> ll = new LinkedList<>();
        for(int i=0; i<3; i++) {
            for(int j=0; j<3; j++) {
                if(products.get(i).get(j) < 5) {
                    ll.add(products.get(i).get(j)*2);
                }
            }
        }

        System.out.println(products);
        
        System.out.println(ll);
        
    }
}
