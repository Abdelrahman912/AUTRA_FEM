using AUTRA.FEM.Entities.NumericalIntegration;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;

namespace AUTRA.FEM.Entities.FEValues
{
    public class GPCellValue
    {

        #region private fields
        private Lazy<Matrix<double>> _b;
        private Lazy<double> _detJ;
        #endregion

        #region Properties
        public GaussPoint GaussPoint { get; }
        public List<Vector2D> dNdX { get; }
        public Matrix<double> J { get; set; }

        public Matrix<double> B =>_b.Value;

        public double DetJ => _detJ.Value;

        #endregion

        #region Constructors
        public GPCellValue(GaussPoint gaussPoint,  List<Vector2D> dndx, Matrix<double> j)
        {
            GaussPoint = gaussPoint;
            dNdX = dndx;
            J = j;
            _b = new Lazy<Matrix<double>>(CalculateB);
            _detJ = new Lazy<double>(() => J.Determinant());
        }
        #endregion

        #region Methods

        private Matrix<double> CalculateB()
        {
            var B = Matrix<double>.Build.Dense(3, 2*dNdX.Count);
            for (int i = 0; i < dNdX.Count; i++)
            {
                B[0, 2 * i] = dNdX[i].X;
                B[1, 2 * i + 1] = dNdX[i].Y;
                B[2, 2 * i] = dNdX[i].Y;
                B[2, 2 * i + 1] = dNdX[i].X;
            }
            return B;
        }

        public Matrix<double> CalculateK(Matrix<double> C,double h)
        {
            var K = B.TransposeThisAndMultiply(C).Multiply(B).Multiply(DetJ) * h * GaussPoint.W1 * GaussPoint.W2;
            return K;
        }

        #endregion
    }
}
