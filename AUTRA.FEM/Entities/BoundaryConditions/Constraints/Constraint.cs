using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Entities.BoundaryConditions.Constraints
{
    public abstract class Constraint
    {
        public bool[] Free { get; }
        protected Constraint(bool[] free)
        {
            Free = free;
        }
    }
}
