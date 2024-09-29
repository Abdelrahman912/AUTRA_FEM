using MathNet.Numerics.LinearAlgebra;
using System;

namespace AUTRA.FEM.Entities.ConstitutiveLaw
{
    public class PlaneStress : ConstitutiveLaw2D
    {
        #region private fields

        private Lazy<Matrix<double>> _c;

        #endregion

        #region Properties
        public override Matrix<double> C => _c.Value;

        #endregion

        #region Constructors

        public PlaneStress(double E, double v)
            :base(E, v)
        {
            _c = new Lazy<Matrix<double>>(CalculateC);
        }

        #endregion

        #region MyRegion

        private Matrix<double> CalculateC()
        {
            var C =  Matrix<double>.Build.DenseOfArray(new double[,]
            {
                {1, v, 0},
                {v,1,0},
                {0,0,(1-v)/2.0}
            });
            return C * E / (1 - v * v);
        }

        #endregion

    }
}
