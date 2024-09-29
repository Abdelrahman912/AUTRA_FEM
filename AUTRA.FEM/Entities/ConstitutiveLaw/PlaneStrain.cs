using MathNet.Numerics.LinearAlgebra;
using System;

namespace AUTRA.FEM.Entities.ConstitutiveLaw
{
    public class PlaneStrain : ConstitutiveLaw2D
    {

        #region private fields

        private Lazy<Matrix<double>> _c;

        #endregion

        #region Properties
        public override Matrix<double> C => _c.Value;

        #endregion

        #region Constructors

        public PlaneStrain(double E, double v)
            : base(E, v)
        {
            _c = new Lazy<Matrix<double>>(CalculateC);
        }

        #endregion

        #region MyRegion

        private Matrix<double> CalculateC()
        {
            var C = Matrix<double>.Build.DenseOfArray(new double[,]
            {
                {1-v, v, 0},
                {v,1-v,0},
                {0,0,(1-2*v)/2.0}
            });
            return C * (E / ((1+v)*(1-2*v)));
        }

        #endregion
    }
}
