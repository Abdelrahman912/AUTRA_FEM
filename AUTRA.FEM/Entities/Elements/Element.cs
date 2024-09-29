using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Entities.Elements
{
    public abstract class Element
    {
        public int Id { get; set; }
        protected Element(int id)
        {
            Id = id;
        }
    }
}
