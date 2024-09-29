using MathNet.Numerics.LinearAlgebra;
using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Entities.ConstitutiveLaw
{
    public abstract class ConstitutiveLaw2D
    {
        #region Properties
        public double E { get;}
        public double v { get; }
        public abstract Matrix<double> C { get; }
        #endregion

        #region Constructors
        protected ConstitutiveLaw2D(double youngModulus, double poissonRatio)
        {
            E = youngModulus;
            v = poissonRatio;
        }
        #endregion


    }
}
