using AUTRA.FEM.Entities.BoundaryConditions;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AUTRA.FEM.Entities.Elements
{
    public class Node
    {
        public int Id { get;}
        public Vector3D Position { get; }
        public Constraint Constraint { get; }
        public NodalForce NodalForce { get; }
        public Node(int id, double x1, double x2, double x3, Constraint constraint, NodalForce force)
        {
            Id = id;
            Position = new Vector3D(x1, x2, x3);
            Constraint = constraint;
            NodalForce = force;
        }
        public Node(int id, double x1, double x2, double x3, Constraint constraint)
        {
            Id = id;
            Position = new Vector3D(x1, x2, x3);
            Constraint = constraint;
            NodalForce = new NodalForce();
        }
        public Node(int id, double x1, double x2, double x3,  NodalForce force)
        {
            Id = id;
            Position = new Vector3D(x1, x2, x3);
            Constraint = new Constraint();
            NodalForce = force;
        }
        public Node(double x1, double x2, double x3)
        {
            Position = new Vector3D(x1, x2, x3);
            Constraint = new Constraint();
            NodalForce = new NodalForce();
        }

        public override string ToString()
        {
            return $"Position: {Position}, Constraint: {Constraint}, NodalForce: {NodalForce}";
        }
    }
}


//package fem;

//import inf.text.ArrayFormat;
//import iceb.jnumerics.Vector3D;

//public class Node
//{
//    private int[] dofNumbers = new int[3];
//    private Constraint constraint;
//    private Force force;
//    private Vector3D position;
//    private Vector3D displacement;

//    public Node(double x1, double x2, double x3)
//    {
//        position = new Vector3D(x1, x2, x3);
//        constraint = new Constraint(true, true, true);
//    }

//    public void setConstraint(Constraint c)
//    {
//        constraint = c;
//    }

//    public Constraint getConstraint()
//    {
//        return constraint;
//    }

//    public void setForce(Force f)
//    {
//        force = f;
//    }

//    public Force getForce()
//    {
//        return force;
//    }


//    public int enumerateDOFs(int start)
//    {
//        for (int i = 0; i < 3; i++)
//        {
//            if (constraint.isFree(i))
//            {
//                dofNumbers[i] = start++; //assign first and then increment
//            }
//            else
//            {
//                dofNumbers[i] = -1;
//            }
//        }
//        return start;
//    }

//    public int[] getDOFNumbers()
//    {
//        return dofNumbers;
//    }

//    public Vector3D getPosition()
//    {
//        return position;
//    }

//    public void setDisplacement(double[] u)
//    {
//        displacement = new Vector3D(u[0], u[1], u[2]);
//    }


//    public Vector3D getDisplacement()
//    {
//        return displacement;
//    }

//    public void print()
//    {
//        //System.out.println("Node:");
//        System.out.println("Position: " + ArrayFormat.format(this.position.toArray()));
//        //System.out.println("Displacement: " + ArrayFormat.format(this.displacement.toArray()));
//        //constraint.print();
//        //force.print();
//    }
//}
