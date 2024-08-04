using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Double;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AUTRA.FEM.Entities.Elements
{
    public class LineElement
    {
        #region Private Fields
        private Matrix<double> k;
        #endregion

        #region Properties
        public int Id { get; }
        public double A { get; }
        public double E { get; }
        public Node Node1 { get; }
        public Node Node2 { get; }
        public double Length => (Node2.Position - Node1.Position).Length;
        #endregion

        #region Constructors
        public LineElement(int id, Node n1, Node n2, double e, double a)
        {
            Id = id;
            Node1 = n1;
            Node2 = n2;
            E = e;
            A = a;
        }
        #endregion


        #region Methods
        public Matrix<double> ComputeStiffnessMatrix()
        {
            if(k != null)
            {
                return k;
            }
            // Stiffness matrix for a truss element (Linear Element)
            // k = E*A/L * [1 -1; -1 1]
            var x1 = Node1.Position;
            var x2 = Node2.Position;
            var k11 = (x1 - x2).ToVector().OuterProduct((x1 - x2).ToVector());
            var k12 = (x1 - x2).ToVector().OuterProduct((x2 - x1).ToVector());
            var k21 = (x2 - x1).ToVector().OuterProduct((x1 - x2).ToVector());
            var k22 = (x2 - x1).ToVector().OuterProduct((x2 - x1).ToVector());
            k = new DenseMatrix(6, 6);
            k.SetSubMatrix(0, 0, k11);
            k.SetSubMatrix(3, 0, k12);
            k.SetSubMatrix(0, 3, k21);
            k.SetSubMatrix(3, 3, k22);
            k = k *  E * A / Math.Pow(Length, 3);
            return k;
        }
        #endregion



    }
}

//package fem;

//import iceb.jnumerics.Array2DMatrix;
//import iceb.jnumerics.BLAM;
//import iceb.jnumerics.IMatrix;
//import iceb.jnumerics.Vector3D;

//public class Element
//{
//    private double area;
//    private double eModulus;
//    private int[] dofNumbers = new int[6];
//    private Node node1;
//    private Node node2;

//    public Element(double e, double a, Node n1, Node n2)
//    {
//        eModulus = e;
//        area = a;
//        node1 = n1;
//        node2 = n2;
//    }


//    public double getArea()
//    {
//        return area;
//    }

//    public double getEModulus()
//    {
//        return eModulus;
//    }

//    public Node getNode1()
//    {
//        return node1;
//    }

//    public Node getNode2()
//    {
//        return node2;
//    }


//    public int[] getDOFNumbers()
//    {
//        return dofNumbers;
//    }

//    public double getLength()
//    {
//        return node2.getPosition().subtract(node1.getPosition()).normTwo();
//    }

//    public void enumerateDOFs()
//    {
//        for (int i = 0; i < 3; i++)
//        {
//            this.dofNumbers[i] = this.node1.getDOFNumbers()[i];

//        }
//        for (int i = 0; i < 3; i++)
//        {
//            this.dofNumbers[i + 3] = this.node2.getDOFNumbers()[i];
//        }
//    }

//    public IMatrix computeStiffnessMatrix()
//    {
//        // Stiffness matrix for a truss element (Linear Element)
//        // k = E*A/L * [1 -1; -1 1]
//        Vector3D x1 = node1.getPosition();
//        Vector3D x2 = node2.getPosition();
//        IMatrix k11 = x1.subtract(x2).dyadicProduct(x1.subtract(x2));
//        IMatrix k12 = x1.subtract(x2).dyadicProduct(x2.subtract(x1));
//        IMatrix k21 = x2.subtract(x1).dyadicProduct(x1.subtract(x2));
//        IMatrix k22 = x2.subtract(x1).dyadicProduct(x2.subtract(x1));
//        IMatrix k = new Array2DMatrix(6, 6);
//        k.addMatrix(0, 0, k11);
//        k.addMatrix(2, 0, k12);
//        k.addMatrix(0, 2, k21);
//        k.addMatrix(2, 2, k22);
//        k.multiply(eModulus * area / Math.pow(getLength(), 3));
//        return k;
//    }

//    public void print()
//    {
//        // print E, A, L

//    }
//}
