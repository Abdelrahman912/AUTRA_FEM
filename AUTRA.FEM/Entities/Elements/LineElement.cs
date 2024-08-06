using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Double;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace AUTRA.FEM.Entities.Elements
{
    public class LineElement
    {
        #region Private Fields
        private readonly Lazy<Matrix<double>> _k;
        private readonly Lazy<Matrix<double>> _t;
        private readonly Lazy<Matrix<double>> _b;
        #endregion

        #region Properties
        public int Id { get; }
        public double A { get; }
        public double E { get; }
        public Node Node1 { get; }
        public Node Node2 { get; }
        public double Length => (Node2.Position - Node1.Position).Length;
        public Matrix<double> K => _k.Value;
        public Matrix<double> T => _t.Value;
        public Matrix<double> B => _b.Value;
        #endregion

        #region Constructors
        public LineElement(int id, Node n1, Node n2, double e, double a)
        {
            Id = id;
            Node1 = n1;
            Node2 = n2;
            E = e;
            A = a;
            _k = new Lazy<Matrix<double>>(() => ComputeStiffnessMatrix());
            _t = new Lazy<Matrix<double>>(() => ComputeTransformationMatrix());
            _b = new Lazy<Matrix<double>>(() => ComputeBMatrix());
        }


        #endregion


        #region Methods
        private Matrix<double> ComputeBMatrix()
        {
            var B = new DenseMatrix(1,2);
            B.SetRow(0, new double[] { -1 / Length, 1 / Length });
            return B;
        }

        private Matrix<double> ComputeTransformationMatrix()
        {
            var l = Length;
            var c1 = (Node2.Position.X - Node1.Position.X) / l;
            var c2 = (Node2.Position.Y - Node1.Position.Y) / l;
            var c3 = (Node2.Position.Z - Node1.Position.Z) / l;
            var t = new DenseMatrix(2,6);
            t.SetRow(0, new double[] { c1, c2, c3,0,0,0 });
            t.SetRow(1, new double[] { 0, 0, 0, c1, c2, c3 });
            return t;
        }

        private Matrix<double> ComputeStiffnessMatrix()
        {
            
            // Stiffness matrix for a truss element (Linear Element)
            // k = E*A/L * [1 -1; -1 1]
            var x1 = Node1.Position;
            var x2 = Node2.Position;
            var k11 = (x1 - x2).ToVector().OuterProduct((x1 - x2).ToVector());
            var k12 = (x1 - x2).ToVector().OuterProduct((x2 - x1).ToVector());
            var k21 = (x2 - x1).ToVector().OuterProduct((x1 - x2).ToVector());
            var k22 = (x2 - x1).ToVector().OuterProduct((x2 - x1).ToVector());
            Matrix<double> k = new DenseMatrix(6, 6);
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


